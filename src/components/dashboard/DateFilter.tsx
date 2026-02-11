import { useState } from "react";
import { Calendar, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateFilter as DateFilterType } from "@/types/sale";

interface DateFilterProps {
  filter: DateFilterType;
  onFilterChange: (filter: DateFilterType) => void;
}

export function DateFilter({ filter, onFilterChange }: DateFilterProps) {
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  const presetFilters = [
    { label: "Hoje", days: 0 },
    { label: "7 dias", days: 7 },
    { label: "30 dias", days: 30 },
    { label: "90 dias", days: 90 },
    { label: "6 meses", days: 180 },
  ];

  const handlePreset = (days: number) => {
    if (days === 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      onFilterChange({ ...filter, startDate: today, endDate: new Date() });
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - days);
      onFilterChange({ ...filter, startDate: start, endDate: end });
    }
  };

  const clearFilter = () => {
    onFilterChange({ startDate: null, endDate: null, offerDescription: null });
  };

  return (
    <div className="glass-card p-4 mb-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Filtrar por:</span>
        
        <div className="flex gap-2">
          {presetFilters.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => handlePreset(preset.days)}
              className="border-border/50 hover:border-primary/50 hover:bg-primary/10 text-xs"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        <div className="flex items-center gap-2">
          <Popover open={startOpen} onOpenChange={setStartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary/50 min-w-[140px] justify-start"
              >
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {filter.startDate
                  ? format(filter.startDate, "dd/MM/yyyy", { locale: ptBR })
                  : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
              <CalendarComponent
                mode="single"
                selected={filter.startDate || undefined}
                onSelect={(date) => {
                  onFilterChange({ ...filter, startDate: date || null });
                  setStartOpen(false);
                }}
                locale={ptBR}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground">→</span>

          <Popover open={endOpen} onOpenChange={setEndOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 hover:border-primary/50 min-w-[140px] justify-start"
              >
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {filter.endDate
                  ? format(filter.endDate, "dd/MM/yyyy", { locale: ptBR })
                  : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
              <CalendarComponent
                mode="single"
                selected={filter.endDate || undefined}
                onSelect={(date) => {
                  onFilterChange({ ...filter, endDate: date || null });
                  setEndOpen(false);
                }}
                locale={ptBR}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        {/* Offer Description Filter - Text Input */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div className="relative">
            <Input
              placeholder="Buscar por oferta"
              value={filter.offerDescription || ""}
              onChange={(e) => 
                onFilterChange({ ...filter, offerDescription: e.target.value || null })
              }
              className="w-[260px] bg-secondary border-border/50 focus:border-primary/50 pr-8"
            />
            {filter.offerDescription && (
              <button
                onClick={() => onFilterChange({ ...filter, offerDescription: null })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {(filter.startDate || filter.endDate || filter.offerDescription) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="text-muted-foreground hover:text-foreground"
          >
            Limpar tudo
          </Button>
        )}
      </div>
    </div>
  );
}
