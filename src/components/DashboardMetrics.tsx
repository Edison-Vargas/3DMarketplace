import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Star,
  TrendingUp,
  TrendingDown,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardMetricsProps {
  totalProducts: number;
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
}

export function DashboardMetrics({ 
  totalProducts, 
  totalRevenue, 
  totalOrders, 
  averageRating 
}: DashboardMetricsProps) {
  const metrics = [
    {
      title: 'Total de Produtos',
      value: totalProducts.toString(),
      icon: Package,
      trend: '+12%',
      trendUp: true,
      description: 'produtos cadastrados'
    },
    {
      title: 'Receita Total',
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      icon: DollarSign,
      trend: '+25%',
      trendUp: true,
      description: 'nos últimos 30 dias'
    },
    {
      title: 'Pedidos',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      trend: '+8%',
      trendUp: true,
      description: 'pedidos realizados'
    },
    {
      title: 'Avaliação Média',
      value: averageRating.toFixed(1),
      icon: Star,
      trend: '+0.2',
      trendUp: true,
      description: 'avaliação geral'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="glass hover-3d">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="p-2 rounded-lg bg-primary/20">
              <metric.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold gradient-text">
                {metric.value}
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={metric.trendUp ? "default" : "destructive"}
                  className="text-xs"
                >
                  {metric.trendUp ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metric.trend}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}