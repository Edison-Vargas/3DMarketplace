import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeItem(itemId);
    toast({
      title: "Produto removido",
      description: `${itemName} foi removido do seu carrinho.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrinho limpo",
      description: "Todos os produtos foram removidos do seu carrinho.",
    });
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para finalizar a compra.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
              <p className="text-muted-foreground mb-8">
                Que tal explorar nossos produtos incríveis de impressão 3D?
              </p>
              <Link to="/catalog">
                <Button className="btn-hero">
                  Explorar Produtos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Seu <span className="gradient-text">Carrinho</span>
            </h1>
            <p className="text-muted-foreground">
              {items.length} produto{items.length !== 1 ? 's' : ''} no seu carrinho
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="glass border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">por {item.sellerName}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            className="text-destructive hover:text-destructive p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 text-xs mb-3">
                          <span className="px-2 py-1 bg-secondary rounded text-secondary-foreground">
                            {item.printType}
                          </span>
                          <span className="px-2 py-1 bg-secondary rounded text-secondary-foreground">
                            {item.material}
                          </span>
                          {item.color && (
                            <span className="px-2 py-1 bg-secondary rounded text-secondary-foreground">
                              {item.color}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold gradient-text">
                              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-xs text-muted-foreground">
                                R$ {item.price.toFixed(2).replace('.', ',')} cada
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleClearCart}
                  className="text-destructive hover:text-destructive"
                >
                  Limpar Carrinho
                </Button>
                <Link to="/catalog">
                  <Button variant="outline" className="glass border-border/50">
                    Continuar Comprando
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="glass border-border/50 sticky top-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} itens)</span>
                      <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Frete</span>
                      <span>Calculado no checkout</span>
                    </div>
                  </div>
                  
                  <Separator className="mb-4" />
                  
                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span className="gradient-text">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <Button 
                    className="w-full btn-hero mb-3"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="text-xs text-muted-foreground text-center">
                    Compra 100% segura e protegida
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}