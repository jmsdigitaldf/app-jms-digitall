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

const serviceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  priceMin: z.coerce.number().min(0, 'Preço mínimo deve ser maior que 0'),
  priceMax: z.coerce.number().min(0, 'Preço máximo deve ser maior que 0'),
  estimatedTime: z.string().min(1, 'Tempo estimado é obrigatório'),
  isActive: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface Service extends ServiceFormData {
  id: string;
}

interface ServiceFormProps {
  service?: Service | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (service: ServiceFormData) => void;
}

const categories = ['Laptops', 'Desktops', 'Software', 'Manutenção', 'Hardware', 'Consultoria'];

export default function ServiceForm({ service, isOpen, onOpenChange, onSave }: ServiceFormProps) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      priceMin: 0,
      priceMax: 0,
      estimatedTime: '',
      isActive: true,
    },
  });

  const isActive = watch('isActive');

  useEffect(() => {
    if (service) {
      setValue('name', service.name);
      setValue('category', service.category);
      setValue('description', service.description);
      setValue('priceMin', service.priceMin);
      setValue('priceMax', service.priceMax);
      setValue('estimatedTime', service.estimatedTime);
      setValue('isActive', service.isActive);
    } else {
      reset();
    }
  }, [service, isOpen, setValue, reset]);

  const onSubmit = (data: ServiceFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{service ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <Label htmlFor="name">Nome do Serviço *</Label>
            <Input id="name" {...register('name')} placeholder="Troca de Tela, Upgrade SSD..." />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select onValueChange={(value) => setValue('category', value)} defaultValue={service?.category || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
            </div>

            <div>
              <Label htmlFor="estimatedTime">Tempo Estimado *</Label>
              <Input id="estimatedTime" {...register('estimatedTime')} placeholder="1-2 dias, 2-3 horas..." />
              {errors.estimatedTime && <p className="text-sm text-red-500">{errors.estimatedTime.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea id="description" {...register('description')} placeholder="Detalhes sobre o serviço..." />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priceMin">Preço Mínimo (R$) *</Label>
              <Input id="priceMin" type="number" step="0.01" {...register('priceMin')} placeholder="0.00" />
              {errors.priceMin && <p className="text-sm text-red-500">{errors.priceMin.message}</p>}
            </div>

            <div>
              <Label htmlFor="priceMax">Preço Máximo (R$) *</Label>
              <Input id="priceMax" type="number" step="0.01" {...register('priceMax')} placeholder="0.00" />
              {errors.priceMax && <p className="text-sm text-red-500">{errors.priceMax.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <input 
              id="isActive" 
              type="checkbox"
              checked={isActive}
              onChange={(e) => setValue('isActive', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2"
            />
            <Label htmlFor="isActive" className="font-normal cursor-pointer">Serviço ativo</Label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-brand-primary to-brand-secondary">
              {service ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
