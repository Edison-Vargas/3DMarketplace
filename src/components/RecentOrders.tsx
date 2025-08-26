import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingCart, Calendar, Package } from 'lucide-react';

// Mock recent orders data
const recentOrders = [
  {
    id: 'ORD-001',
    customerName: 'Manuela Costa',
    customerAvatar: '',
    productName: 'Dragão Místico - Miniatura RPG',
    amount: 45.90,
    status: 'completed',
    date: '2024-01-25',
    quantity: 1
  },
  {
    id: 'ORD-002',
    customerName: 'Carlos Silva',
    customerAvatar: '',
    productName: 'Vaso Decorativo Geométrico',
    amount: 65.00,
    status: 'processing',
    date: '2024-01-24',
    quantity: 2
  },
  {
    id: 'ORD-003',
    customerName: 'Ana Santos',
    customerAvatar: '',  
    productName: 'Kit de Peças para Drone',
    amount: 67.80,
    status: 'shipped',
    date: '2024-01-23',
    quantity: 1
  },
  {
    id: 'ORD-004',
    customerName: 'José Oliveira',
    customerAvatar: '',
    productName: 'Organizador de Mesa Modular',
    amount: 108.60,
    status: 'pending',
    date: '2024-01-22',
    quantity: 2
  }
];

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const },
  processing: { label: 'Processando', variant: 'default' as const },
  shipped: { label: 'Enviado', variant: 'outline' as const },
  completed: { label: 'Concluído', variant: 'default' as const }
};

export function RecentOrders() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Pedidos Recentes
        </CardTitle>
        <CardDescription>
          Últimos pedidos dos seus produtos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div 
              key={order.id} 
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={order.customerAvatar} />
                <AvatarFallback>
                  {order.customerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm truncate">
                    {order.customerName}
                  </p>
                  <Badge 
                    variant={statusConfig[order.status as keyof typeof statusConfig].variant}
                    className="text-xs"
                  >
                    {statusConfig[order.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground truncate mb-1">
                  {order.productName}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {order.quantity}x
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(order.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <span className="font-medium text-primary">
                    R$ {order.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {recentOrders.length === 0 && (
            <div className="text-center py-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Nenhum pedido recente
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}