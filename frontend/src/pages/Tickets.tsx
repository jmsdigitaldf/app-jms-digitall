import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Plus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ticketService } from '@/services';
import { formatDateTime, getStatusColor, getStatusLabel, getPriorityColor, getPriorityLabel } from '@/lib/utils';

export function Tickets() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', { page, limit, search, status: statusFilter }],
    queryFn: () => ticketService.list({ page, limit, search, status: statusFilter }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Atendimentos</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os atendimentos</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Novo Atendimento
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, protocolo..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="QUOTED">Orçado</option>
              <option value="APPROVED">Aprovado</option>
              <option value="COMPLETED">Concluído</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Protocolo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Problema</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Wrench className="h-4 w-4 animate-spin" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum atendimento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">#{ticket.protocol}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.customer.name}</p>
                        <p className="text-sm text-gray-500">{ticket.customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{ticket.problemType.replace('_', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {getPriorityLabel(ticket.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDateTime(ticket.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {((page - 1) * limit) + 1} a {Math.min(page * limit, data.meta.total)} de{' '}
            {data.meta.total} resultados
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === data.meta.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tickets;
