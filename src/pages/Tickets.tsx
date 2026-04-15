import { useState } from 'react';
import { Search, Plus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDataStore } from '@/stores';
import { formatDateTime, getStatusColor, getStatusLabel, getPriorityColor, getPriorityLabel, getProblemTypeLabel } from '@/lib/utils';

export function Tickets() {
  const { tickets } = useDataStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.customer.name.toLowerCase().includes(search.toLowerCase()) ||
                         ticket.protocol.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
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

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar por cliente, protocolo..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              className="flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="QUOTED">Orçado</option>
              <option value="APPROVED">Aprovado</option>
              <option value="COMPLETED">Concluído</option>
            </select>
          </div>
        </CardContent>
      </Card>

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum atendimento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">#{ticket.protocol}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ticket.customer.name}</p>
                        <p className="text-sm text-gray-500">{ticket.customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm">{getProblemTypeLabel(ticket.problemType)}</span></TableCell>
                    <TableCell><Badge className={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</Badge></TableCell>
                    <TableCell><Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge></TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDateTime(ticket.createdAt)}</TableCell>
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
