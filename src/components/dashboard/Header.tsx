import eaaLogo from "@/assets/eaa-logo.png";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onRefresh: () => void;
  isLoading?: boolean;
  lastUpdate?: Date;
}

export function Header({ onRefresh, isLoading, lastUpdate }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 glass-card mb-6">
      <div className="flex items-center gap-4">
        <img src={eaaLogo} alt="EAA Logo" className="h-12 w-12 rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text">EAA</span>
            <span className="text-foreground"> Dashboard</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Análise de vendas em tempo real
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {lastUpdate && (
          <span className="text-xs text-muted-foreground">
            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
    </header>
  );
}
