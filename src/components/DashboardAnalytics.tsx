import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Eye,
  Calendar,
  Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for analytics
const revenueData = [
  { month: 'Jan', revenue: 12500, orders: 45, customers: 38 },
  { month: 'Fev', revenue: 15200, orders: 52, customers: 41 },
  { month: 'Mar', revenue: 18300, orders: 68, customers: 55 },
  { month: 'Abr', revenue: 16800, orders: 61, customers: 48 },
  { month: 'Mai', revenue: 21400, orders: 75, customers: 62 },
  { month: 'Jun', revenue: 24100, orders: 82, customers: 71 }
];

const productPerformance = [
  { name: 'Miniatura Dragon', sales: 156, revenue: 7800 },
  { name: 'Vaso Geométrico', sales: 143, revenue: 7150 },
  { name: 'Escultura Abstrata', sales: 98, revenue: 5880 },
  { name: 'Peça Decorativa', sales: 87, revenue: 4350 },
  { name: 'Modelo Arquitetônico', sales: 76, revenue: 3800 }
];

const categoryDistribution = [
  { name: 'Decoração', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Miniaturas', value: 28, color: 'hsl(var(--chart-2))' },
  { name: 'Arte', value: 22, color: 'hsl(var(--chart-3))' },
  { name: 'Utilitários', value: 15, color: 'hsl(var(--chart-4))' }
];

const customerBehavior = [
  { day: 'Seg', views: 245, orders: 12 },
  { day: 'Ter', views: 298, orders: 18 },
  { day: 'Qua', views: 387, orders: 22 },
  { day: 'Qui', views: 456, orders: 28 },
  { day: 'Sex', views: 523, orders: 35 },
  { day: 'Sáb', views: 612, orders: 42 },
  { day: 'Dom', views: 334, orders: 19 }
];

export function DashboardAnalytics() {
  const kpis = [
    {
      title: 'Taxa de Conversão',
      value: '4.8%',
      change: '+0.5%',
      trend: 'up',
      icon: Target,
      description: 'visitantes que compraram'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 285',
      change: '+R$ 23',
      trend: 'up',
      icon: DollarSign,
      description: 'valor médio por pedido'
    },
    {
      title: 'Visualizações',
      value: '12.4K',
      change: '+18%',
      trend: 'up',
      icon: Eye,
      description: 'views nos produtos'
    },
    {
      title: 'Clientes Únicos',
      value: '847',
      change: '-2%',
      trend: 'down',
      icon: Users,
      description: 'clientes únicos'
    }
  ];

  return (
    <div className="space-y-8">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="glass hover-3d">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/20">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold gradient-text">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={kpi.trend === 'up' ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {kpi.change}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {kpi.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Receita Mensal
                </CardTitle>
                <CardDescription>
                  Evolução da receita nos últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Distribuição por Categoria
                </CardTitle>
                <CardDescription>
                  Vendas por categoria de produto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Performance Semanal
              </CardTitle>
              <CardDescription>
                Comparativo de visualizações vs pedidos por dia da semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={customerBehavior}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="views" fill="hsl(var(--chart-2))" name="Visualizações" />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" name="Pedidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Top Produtos por Performance
              </CardTitle>
              <CardDescription>
                Produtos com melhor desempenho em vendas e receita
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={productPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" name="Vendas" />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-3))" name="Receita (R$)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Crescimento de Clientes
              </CardTitle>
              <CardDescription>
                Evolução da base de clientes ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Novos Clientes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={3}
                    name="Pedidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}