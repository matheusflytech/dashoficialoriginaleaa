import { useState, useMemo } from "react";
import { Sale } from "@/types/sale";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseBrazilianDate } from "@/lib/dateUtils";

interface SalesTableProps {
  sales: Sale[];
}

type SortField = "order_date" | "value" | "product_name" | "buyer_name";
type SortDirection = "asc" | "desc";

export function SalesTable({ sales }: SalesTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("order_date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedSales = useMemo(() => {
    let result = [...sales];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (sale) =>
          sale.buyer_name.toLowerCase().includes(searchLower) ||
          sale.buyer_email.toLowerCase().includes(searchLower) ||
          sale.product_name.toLowerCase().includes(searchLower) ||
          sale.transaction.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "order_date":
          comparison = parseBrazilianDate(a.order_date).getTime() - parseBrazilianDate(b.order_date).getTime();
          break;
        case "value":
          comparison = a.value - b.value;
          break;
        case "product_name":
          comparison = a.product_name.localeCompare(b.product_name);
          break;
        case "buyer_name":
          comparison = a.buyer_name.localeCompare(b.buyer_name);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [sales, search, sortField, sortDirection]);

  const paginatedSales = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAndSortedSales.slice(start, start + itemsPerPage);
  }, [filteredAndSortedSales, page]);

  const totalPages = Math.ceil(filteredAndSortedSales.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Vendas Recentes</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar vendas..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 w-[250px] bg-secondary border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("order_date")}
              >
                <div className="flex items-center gap-1">
                  Data
                  <SortIcon field="order_date" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("buyer_name")}
              >
                <div className="flex items-center gap-1">
                  Cliente
                  <SortIcon field="buyer_name" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("product_name")}
              >
                <div className="flex items-center gap-1">
                  Produto
                  <SortIcon field="product_name" />
                </div>
              </TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>SCK</TableHead>
              <TableHead
                className="cursor-pointer hover:text-primary transition-colors text-right"
                onClick={() => handleSort("value")}
              >
                <div className="flex items-center justify-end gap-1">
                  Valor
                  <SortIcon field="value" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSales.map((sale, index) => (
              <TableRow 
                key={sale.transaction} 
                className="table-row-hover border-border/30"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-medium">
                  <div>
                    <p>{format(parseBrazilianDate(sale.order_date), "dd/MM/yyyy", { locale: ptBR })}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseBrazilianDate(sale.order_date), "HH:mm")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{sale.buyer_name}</p>
                    <p className="text-xs text-muted-foreground">{sale.buyer_email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p>{sale.product_name}</p>
                    <p className="text-xs text-muted-foreground">{sale.offer_code}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {sale.src}
                  </span>
                </TableCell>
                <TableCell>
                  {sale.sck ? (
                    <span className="text-sm text-muted-foreground">{sale.sck}</span>
                  ) : null}
                </TableCell>
                <TableCell className="text-right font-semibold text-success">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Mostrando {((page - 1) * itemsPerPage) + 1} a {Math.min(page * itemsPerPage, filteredAndSortedSales.length)} de {filteredAndSortedSales.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm rounded-md border border-border/50 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm rounded-md border border-border/50 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/50 hover:bg-primary/10 transition-all"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
