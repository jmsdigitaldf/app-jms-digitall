import { useEffect, useState } from 'react';
import { Wrench, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatCurrency } from '@/lib/utils';
import { servicesAPI } from '@/services/api';
import ServiceForm from '@/components/service-form';

interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  priceMin: number;
  priceMax: number;
  estimatedTime?: string;
  isActive: boolean;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar serviços do banco
  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
                         service.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services.map(s => s.category))].sort();

  const handleAddService = async (service: Omit<Service, 'id'>) => {
    try {
      await servicesAPI.create(service);
      await loadServices();
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
    }
  };

  const handleUpdateService = async (id: string, service: Omit<Service, 'id'>) => {
    try {
      await servicesAPI.update(id, service);
      await loadServices();
      setEditingService(null);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await servicesAPI.delete(id);
      await loadServices();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-500 mt-1">Gerencie os serviços e tabela de preços</p>
        </div>
        <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary" onClick={() => { setEditingService(null); setIsCreateOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Buscar por nome ou descrição..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              className="flex h-10 w-[200px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Preço (Min - Máx)</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum serviço encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell><Badge className="bg-blue-100 text-blue-800">{service.category}</Badge></TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-xs truncate">{service.description}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(service.priceMin)} - {formatCurrency(service.priceMax)}</TableCell>
                    <TableCell className="text-sm">{service.estimatedTime}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {service.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setEditingService(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteConfirm(service.id)}>
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
      <ServiceForm
        service={editingService}
        isOpen={isCreateOpen || !!editingService}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingService(null);
          }
        }}
        onSave={(service) => {
          if (editingService) {
            handleUpdateService(editingService.id, service);
          } else {
            handleAddService(service);
          }
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Deletar Serviço</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar este serviço? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteConfirm) {
                  handleDeleteService(deleteConfirm);
                  setDeleteConfirm(null);
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
