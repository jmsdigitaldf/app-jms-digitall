import { useQuery } from '@tanstack/react-query';
import { FileText, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { quoteService } from '@/services';
import { formatCurrency, formatDateTime } from '@/lib/utils';

export function Quotes() {
  const { data, isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => quoteService.list({ limit: 20, page: 1 }),
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orçamentos</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os orçamentos</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary">
          <FileText className="h-4 w-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.meta?.total || 0}</div>
            <p className="text-xs text-gray-500">orçamentos cadastrados</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {data?.data?.filter((q) => q.status === 'PENDING').length || 0}
            </div>
            <p className="text-xs text-gray-500">aguardando aprovação</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(
                data?.data
                  ?.filter((q) => q.status === 'APPROVED')
                  .reduce((acc, q) => acc + q.price, 0) || 0
              )}
            </div>
            <p className="text-xs text-gray-500">orçamentos aprovados</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Protocolo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum orçamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{quote.service}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {quote.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {quote.ticket?.customer?.name || 'Cliente'}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      #{quote.ticket?.protocol || '-'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(quote.price)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusLabel(quote.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDateTime(quote.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Quotes;
