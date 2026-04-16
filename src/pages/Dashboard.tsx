import { useEffect, useState } from 'react';
import { Ticket, Users, CheckCircle, DollarSign, Clock, TrendingUp, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ticketsAPI, customersAPI } from '@/services/api';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';

function MetricCard({ title, value, change, trend, icon: Icon, color }: any) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}><Icon className="h-4 w-4 text-white" /></div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className={`h-3 w-3 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% desde o último mês
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const response = await ticketsAPI.getAll();
      setTickets(response.data);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([loadTickets(), loadCustomers()]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Calcular stats baseado nos tickets
  const stats = {
    total: tickets.length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tickets.filter(t => t.status === 'COMPLETED').length,
    revenue: tickets
      .filter(t => t.status === 'COMPLETED' && t.quotes?.length > 0)
      .reduce((acc, t) => acc + (t.quotes?.[0]?.price || 0), 0),
    today: tickets.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.createdAt).toDateString() === today;
    }).length,
  };

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Visão geral dos atendimentos e métricas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total de Atendimentos" value={stats.total} change={12} trend="up" icon={Ticket} color="bg-blue-500" />
        <MetricCard title="Em Andamento" value={stats.inProgress} icon={Clock} color="bg-yellow-500" />
        <MetricCard title="Concluídos" value={stats.completed} change={8} trend="up" icon={CheckCircle} color="bg-green-500" />
        <MetricCard title="Receita Total" value={formatCurrency(stats.revenue)} change={15} trend="up" icon={DollarSign} color="bg-brand-primary" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total de Clientes" value={customers.length} icon={Users} color="bg-purple-500" />
        <MetricCard title="Atendimentos Hoje" value={stats.today} icon={Ticket} color="bg-pink-500" />
        <MetricCard title="Ticket Médio" value={formatCurrency(stats.completed ? stats.revenue / stats.completed : 0)} icon={TrendingUp} color="bg-indigo-500" />
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-brand-primary" />
            Atendimentos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{ticket.customer.name}</p>
                      <Badge variant="outline" className="text-xs">#{ticket.protocol}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{ticket.problemType.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                  <p className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
