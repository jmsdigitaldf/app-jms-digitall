import { Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

const services = [
  {
    category: 'Laptops',
    items: [
      { name: 'Troca de Tela', priceMin: 300, priceMax: 800, time: '2-3 dias' },
      { name: 'Troca de Bateria', priceMin: 200, priceMax: 500, time: '1-2 dias' },
      { name: 'Troca de Teclado', priceMin: 150, priceMax: 400, time: '1-2 dias' },
      { name: 'Reparo Jack de Energia', priceMin: 150, priceMax: 350, time: '1-2 dias' },
    ],
  },
  {
    category: 'Desktops',
    items: [
      { name: 'Troca de Monitor', priceMin: 400, priceMax: 1200, time: '2-4 dias' },
      { name: 'Upgrade SSD', priceMin: 250, priceMax: 800, time: '1 dia' },
      { name: 'Upgrade RAM', priceMin: 180, priceMax: 600, time: '1 dia' },
    ],
  },
  {
    category: 'Software',
    items: [
      { name: 'Formatação Windows', priceMin: 100, priceMax: 150, time: '1 dia' },
      { name: 'Remoção de Vírus', priceMin: 80, priceMax: 150, time: '1-2 dias' },
      { name: 'Instalação de Software', priceMin: 50, priceMax: 100, time: '2-4 horas' },
      { name: 'Recuperação de Dados', priceMin: 200, priceMax: 800, time: '3-5 dias' },
    ],
  },
  {
    category: 'Manutenção',
    items: [
      { name: 'Limpeza Preventiva', priceMin: 80, priceMax: 150, time: '1 dia' },
      { name: 'Troca Pasta Térmica', priceMin: 100, priceMax: 180, time: '1 dia' },
      { name: 'Diagnóstico Técnico', priceMin: 50, priceMax: 100, time: '2-4 horas' },
    ],
  },
];

export function Services() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
        <p className="text-gray-500 mt-1">Tabela de preços e serviços disponíveis</p>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((category) => (
          <Card key={category.category} className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-brand-primary" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.items.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-brand-primary">
                        {formatCurrency(service.priceMin)} - {formatCurrency(service.priceMax)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informações Importantes</CardTitle>
          <CardDescription>
            Diretrizes para precificação e orçamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Badge variant="secondary">1</Badge>
            <p className="text-sm text-gray-600">
              Os valores apresentados são estimativas. O preço final pode variar após análise técnica completa.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">2</Badge>
            <p className="text-sm text-gray-600">
              Para orçamentos acima de R$ 500, é necessário aprovação do gerente.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">3</Badge>
            <p className="text-sm text-gray-600">
              Serviços de recuperação de dados não possuem garantia de sucesso total.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary">4</Badge>
            <p className="text-sm text-gray-600">
              Todos os serviços possuem garantia de 90 dias para o mesmo problema.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Services;
