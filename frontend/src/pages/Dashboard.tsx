import { useQuery } from '@tanstack/react-query';
import {
  Ticket,
  Users,
  CheckCircle,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ticketService, customerService, quoteService } from '@/services';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp
              className={`h-3 w-3 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}
            />
            <span className={`text-xs ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
              {change > 0 ? '+' : ''}{change}% desde o último mês
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  // Fetch statistics
  const { data: ticketStats } = useQuery({
    queryKey: ['ticket-stats'],
    queryFn: () => ticketService.getStats(),
  });

  const { data: customerStats } = useQuery({
    queryKey: ['customer-stats'],
    queryFn: () => customerService.getStats(),
  });

  const { data: quoteStats } = useQuery({
    queryKey: ['quote-stats'],
    queryFn: () => quoteService.getStats(),
  });

  // Fetch recent tickets
  const { data: recentTickets } = useQuery({
    queryKey: ['recent-tickets'],
    queryFn: () => ticketService.list({ limit: 5, page: 1 }),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral dos atendimentos e métricas</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Atendimentos"
          value={ticketStats?.total || 0}
          change={12}
          trend="up"
          icon={Ticket}
          color="bg-blue-500"
        />
        <MetricCard
          title="Em Andamento"
          value={ticketStats?.inProgress || 0}
          icon={Clock}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Concluídos"
          value={ticketStats?.completed || 0}
          change={8}
          trend="up"
          icon={CheckCircle}
          color="bg-green-500"
        />
        <MetricCard
          title="Receita Total"
          value={formatCurrency(ticketStats?.revenue || 0)}
          change={15}
          trend="up"
          icon={DollarSign}
          color="bg-brand-primary"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total de Clientes"
          value={customerStats?.total || 0}
          icon={Users}
          color="bg-purple-500"
        />
        <MetricCard
          title="Orçamentos Pendentes"
          value={quoteStats?.pending || 0}
          icon={AlertCircle}
          color="bg-orange-500"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(
            ticketStats?.completed ? (ticketStats.revenue / ticketStats.completed) : 0
          )}
          icon={TrendingUp}
          color="bg-pink-500"
        />
      </div>

      {/* Recent tickets */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-brand-primary" />
            Atendimentos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets?.data?.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{ticket.customer.name}</p>
                      <Badge variant="outline" className="text-xs">
                        #{ticket.protocol}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{ticket.problemType.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}

            {(!recentTickets?.data || recentTickets.data.length === 0) && (
              <p className="text-center text-gray-500 py-8">
                Nenhum atendimento encontrado
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
