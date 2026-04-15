import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ticketsAPI, customersAPI } from '@/services/api';
import type { Ticket, Customer } from '@/types';

const ticketSchema = z.object({
  customerId: z.string().min(1, 'Cliente é obrigatório'),
  whatsappMessage: z.string().min(1, 'Mensagem é obrigatória'),
  problemType: z.string().min(1, 'Tipo de problema é obrigatório'),
  deviceType: z.string().min(1, 'Tipo de dispositivo é obrigatório'),
  brand: z.string().optional(),
  model: z.string().optional(),
  priority: z.string().min(1, 'Prioridade é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  ticket?: Ticket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Função para gerar protocolo
const generateProtocol = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  return `${month}${year}-${random}`;
};

export default function TicketForm({ ticket, isOpen, onOpenChange }: TicketFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      customerId: '',
      whatsappMessage: '',
      problemType: '',
      deviceType: '',
      priority: 'MEDIUM',
      status: 'OPEN',
    },
  });

  useEffect(() => {
    // Carregar clientes
    const loadCustomers = async () => {
      try {
        const response = await customersAPI.getAll();
        setCustomers(response.data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    };
    loadCustomers();
  }, []);

  useEffect(() => {
    if (ticket) {
      setValue('customerId', ticket.customerId);
      setValue('whatsappMessage', ticket.whatsappMessage);
      setValue('problemType', ticket.problemType);
      setValue('deviceType', ticket.deviceType);
      setValue('brand', ticket.brand || '');
      setValue('model', ticket.model || '');
      setValue('priority', ticket.priority);
      setValue('status', ticket.status);
    } else {
      reset();
    }
  }, [ticket, isOpen, setValue, reset]);

  const onSubmit = async (data: TicketFormData) => {
    try {
      if (ticket) {
        await ticketsAPI.update(ticket.id, {
          ...data,
          problemType: data.problemType as any,
          deviceType: data.deviceType as any,
          status: data.status as any,
          priority: data.priority as any,
        });
      } else {
        const protocol = generateProtocol();
        await ticketsAPI.create({
          protocol,
          ...data,
          problemType: data.problemType as any,
          deviceType: data.deviceType as any,
          status: data.status as any,
          priority: data.priority as any,
        });
      }
      onOpenChange(false);
      window.location.reload(); // Recarregar para atualizar lista
    } catch (error) {
      console.error('Erro ao salvar atendimento:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{ticket ? 'Editar Atendimento' : 'Novo Atendimento'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <Label htmlFor="customerId">Cliente</Label>
            <Select onValueChange={(value) => setValue('customerId', value)} defaultValue={ticket?.customerId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && <p className="text-sm text-red-500">{errors.customerId.message}</p>}
          </div>

          <div>
            <Label htmlFor="whatsappMessage">Mensagem WhatsApp</Label>
            <Textarea id="whatsappMessage" {...register('whatsappMessage')} placeholder="Descrição do problema..." />
            {errors.whatsappMessage && <p className="text-sm text-red-500">{errors.whatsappMessage.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="problemType">Tipo de Problema</Label>
              <Select onValueChange={(value) => setValue('problemType', value)} defaultValue={ticket?.problemType || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SCREEN">Tela</SelectItem>
                  <SelectItem value="BATTERY">Bateria</SelectItem>
                  <SelectItem value="KEYBOARD">Teclado</SelectItem>
                  <SelectItem value="SLOW_PERFORMANCE">Desempenho Lento</SelectItem>
                  <SelectItem value="VIRUS_MALWARE">Vírus/Malware</SelectItem>
                  <SelectItem value="HARDWARE">Hardware</SelectItem>
                  <SelectItem value="SOFTWARE">Software</SelectItem>
                  <SelectItem value="FORMAT_OS">Formatação/OS</SelectItem>
                  <SelectItem value="DATA_RECOVERY">Recuperação Dados</SelectItem>
                  <SelectItem value="NETWORK_WIFI">Rede/WiFi</SelectItem>
                  <SelectItem value="AUDIO">Áudio</SelectItem>
                  <SelectItem value="POWER_JACK">Jack de Energia</SelectItem>
                  <SelectItem value="MOTHERBOARD">Placa Mãe</SelectItem>
                  <SelectItem value="COOLING">Refrigeração</SelectItem>
                  <SelectItem value="OTHER">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.problemType && <p className="text-sm text-red-500">{errors.problemType.message}</p>}
            </div>

            <div>
              <Label htmlFor="deviceType">Tipo de Dispositivo</Label>
              <Select onValueChange={(value) => setValue('deviceType', value)} defaultValue={ticket?.deviceType || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LAPTOP">Notebook</SelectItem>
                  <SelectItem value="DESKTOP">Desktop</SelectItem>
                  <SelectItem value="ALL_IN_ONE">All-in-One</SelectItem>
                  <SelectItem value="TABLET">Tablet</SelectItem>
                  <SelectItem value="SMARTPHONE">Smartphone</SelectItem>
                  <SelectItem value="OTHER">Outro</SelectItem>
                </SelectContent>
              </Select>
              {errors.deviceType && <p className="text-sm text-red-500">{errors.deviceType.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" {...register('brand')} placeholder="Dell, HP, Lenovo..." />
            </div>
            <div>
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" {...register('model')} placeholder="Inspiron 15, Pavilion..." />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select onValueChange={(value) => setValue('priority', value)} defaultValue={ticket?.priority || 'MEDIUM'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                  <SelectItem value="URGENT">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value)} defaultValue={ticket?.status || 'PENDING'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                  <SelectItem value="QUOTED">Orçado</SelectItem>
                  <SelectItem value="APPROVED">Aprovado</SelectItem>
                  <SelectItem value="WAITING_PART">Aguardando Peça</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-brand-primary to-brand-secondary">
              {ticket ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
