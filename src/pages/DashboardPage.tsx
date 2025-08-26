import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Eye,
  Edit3,
  Trash2,
  Plus,
  BarChart3,
  Calendar,
  Star,
  DollarSign
} from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { ProductForm } from '@/components/ProductForm';
import { ProductManagement } from '@/components/ProductManagement';
import { DashboardMetrics } from '@/components/DashboardMetrics';
import { RecentOrders } from '@/components/RecentOrders';
import { DashboardAnalytics } from '@/components/DashboardAnalytics';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.type !== 'seller') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Acesso Negado</CardTitle>
            <CardDescription>
              Apenas vendedores podem acessar o dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Mock data for seller products
  const sellerProducts = mockProducts.filter(p => p.sellerId === user.id);
  const totalProducts = sellerProducts.length;
  const totalRevenue = sellerProducts.reduce((sum, p) => sum + p.price, 0) * 12; // Mock multiply
  const totalOrders = 156; // Mock data
  const averageRating = user.rating || 4.8;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                Dashboard do Vendedor
              </h1>
              <p className="text-muted-foreground">
                Bem-vindo de volta, {user.name}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                <Star className="w-4 h-4 mr-1 text-warning" />
                {averageRating.toFixed(1)}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {user.location}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Novo Produto
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <DashboardMetrics 
              totalProducts={totalProducts}
              totalRevenue={totalRevenue}
              totalOrders={totalOrders}
              averageRating={averageRating}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Products */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Produtos Recentes
                  </CardTitle>
                  <CardDescription>
                    Seus últimos produtos cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sellerProducts.slice(0, 3).map((product) => (
                       <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                         <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/10">
                           <img 
                             src={product.images[0]} 
                             alt={product.name}
                             className="w-full h-full object-cover"
                             onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.style.display = 'none';
                               const parent = target.parentElement;
                               if (parent && !parent.querySelector('.fallback-icon')) {
                                 const fallback = document.createElement('div');
                                 fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-primary/20';
                                 fallback.innerHTML = '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                                 parent.appendChild(fallback);
                               }
                             }}
                           />
                         </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {product.rating.toFixed(1)} ⭐
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <RecentOrders />
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManagement products={sellerProducts} />
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product">
            <ProductForm />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <DashboardAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;