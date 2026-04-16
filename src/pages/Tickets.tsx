import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ticketsAPI } from '@/services/api';
import { formatDateTime, getStatusColor, getStatusLabel, getPriorityColor, getPriorityLabel, getProblemTypeLabel } from '@/lib/utils';
import TicketForm from '@/components/ticket-form';
import type { Ticket } from '@/types';

export function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar tickets do banco
  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const response = await ticketsAPI.getAll();
      setTickets(response.data);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleDeleteTicket = async (id: string) => {
    try {
      await ticketsAPI.delete(id);
      await loadTickets();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao deletar atendimento:', error);
    }
  };

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
        <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary" onClick={() => { setEditingTicket(null); setIsCreateOpen(true); }}>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingTicket(ticket)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteConfirm(ticket.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <TicketForm
        ticket={editingTicket}
        isOpen={isCreateOpen || !!editingTicket}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingTicket(null);
          }
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Deletar Atendimento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar este atendimento? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteConfirm) {
                  handleDeleteTicket(deleteConfirm);
                }
              }}
            >
              Deletar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
