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
import { customersAPI } from '@/services/api';
import type { Customer } from '@/types';

const customerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  document: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerForm({ customer, isOpen, onOpenChange }: CustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      document: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (customer) {
      setValue('name', customer.name);
      setValue('phone', customer.phone);
      setValue('email', customer.email || '');
      setValue('document', customer.document || '');
      setValue('address', customer.address || '');
      setValue('city', customer.city || '');
      setValue('state', customer.state || '');
      setValue('zipCode', customer.zipCode || '');
      setValue('notes', customer.notes || '');
    } else {
      reset();
    }
  }, [customer, isOpen, setValue, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setIsLoading(true);
      if (customer) {
        await customersAPI.update(customer.id, data);
      } else {
        await customersAPI.create(data);
      }
      onOpenChange(false);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{customer ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" {...register('name')} placeholder="Nome completo" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input id="phone" {...register('phone')} placeholder="(11) 99999-9999" />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register('email')} placeholder="email@example.com" />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="document">Documento (CPF/CNPJ)</Label>
              <Input id="document" {...register('document')} placeholder="123.456.789-00" />
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input id="zipCode" {...register('zipCode')} placeholder="01234-567" />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" {...register('address')} placeholder="Rua, número" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register('city')} placeholder="São Paulo" />
            </div>
            <div>
              <Label htmlFor="state">UF</Label>
              <Input id="state" {...register('state')} placeholder="SP" maxLength={2} />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" {...register('notes')} placeholder="Anotações sobre o cliente..." />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-brand-primary to-brand-secondary" disabled={isLoading}>
              {isLoading ? 'Salvando...' : customer ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
