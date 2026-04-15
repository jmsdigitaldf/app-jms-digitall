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
import { quotesAPI, ticketsAPI } from '@/services/api';
import type { Quote } from '@/types';

const quoteSchema = z.object({
  ticketId: z.string().min(1, 'Atendimento é obrigatório'),
  service: z.string().min(1, 'Serviço é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.coerce.number().min(0, 'Preço deve ser maior que 0'),
  status: z.string().min(1, 'Status é obrigatório'),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  quote?: Quote | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteForm({ quote, isOpen, onOpenChange }: QuoteFormProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      ticketId: '',
      service: '',
      description: '',
      price: 0,
      status: 'PENDING',
    },
  });

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await ticketsAPI.getAll();
        setTickets(response.data);
      } catch (error) {
        console.error('Erro ao carregar atendimentos:', error);
      }
    };
    loadTickets();
  }, []);

  useEffect(() => {
    if (quote) {
      setValue('ticketId', quote.ticketId);
      setValue('service', quote.service);
      setValue('description', quote.description);
      setValue('price', quote.price);
      setValue('status', quote.status);
    } else {
      reset();
    }
  }, [quote, isOpen, setValue, reset]);

  const onSubmit = async (data: QuoteFormData) => {
    try {
      setIsLoading(true);
      if (quote) {
        await quotesAPI.update(quote.id, {
          ...data,
          price: data.price,
          status: data.status as any,
        });
      } else {
        await quotesAPI.create({
          ...data,
          price: data.price,
          status: data.status as any,
        });
      }
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ticketOptions = tickets.filter(t => !quote || t.id === quote.ticketId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{quote ? 'Editar Orçamento' : 'Novo Orçamento'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <Label htmlFor="ticketId">Atendimento *</Label>
            <Select onValueChange={(value) => setValue('ticketId', value)} defaultValue={quote?.ticketId || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um atendimento" />
              </SelectTrigger>
              <SelectContent>
                {ticketOptions.map(ticket => (
                  <SelectItem key={ticket.id} value={ticket.id}>
                    #{ticket.protocol} - {ticket.customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ticketId && <p className="text-sm text-red-500">{errors.ticketId.message}</p>}
          </div>

          <div>
            <Label htmlFor="service">Serviço *</Label>
            <Input id="service" {...register('service')} placeholder="Troca de Tela, Upgrade SSD..." />
            {errors.service && <p className="text-sm text-red-500">{errors.service.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea id="description" {...register('description')} placeholder="Detalhes do serviço..." />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Valor (R$) *</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} placeholder="00.00" />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select onValueChange={(value) => setValue('status', value)} defaultValue={quote?.status || 'PENDING'}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="APPROVED">Aprovado</SelectItem>
                  <SelectItem value="REJECTED">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-brand-primary to-brand-secondary" disabled={isLoading}>
              {isLoading ? 'Salvando...' : quote ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
