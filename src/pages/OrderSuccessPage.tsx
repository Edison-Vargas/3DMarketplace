import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Truck, MessageCircle, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber || 'MP3D' + Date.now();

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Compra <span className="gradient-text">Realizada</span> com Sucesso!
            </h1>
            <p className="text-muted-foreground mb-2">
              Seu pedido foi confirmado e está sendo processado
            </p>
            <p className="text-lg font-semibold">
              Número do pedido: <span className="gradient-text">{orderNumber}</span>
            </p>
          </div>

          <Card className="glass border-border/50 mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Próximos passos</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Preparação do pedido</h3>
                    <p className="text-sm text-muted-foreground">
                      Os vendedores começarão a produzir seus itens personalizados
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 text-left">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Envio e entrega</h3>
                    <p className="text-sm text-muted-foreground">
                      Você receberá o código de rastreamento por email
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 text-left">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Comunicação direta</h3>
                    <p className="text-sm text-muted-foreground">
                      Os vendedores podem entrar em contato para atualizações
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/messages')}
              variant="outline"
              className="glass border-border/50"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ver Mensagens
            </Button>
            <Button 
              onClick={() => navigate('/catalog')}
              className="btn-hero"
            >
              Continuar Comprando
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="mt-8 p-6 bg-muted/20 rounded-lg">
            <h3 className="font-semibold mb-2">Dúvidas sobre seu pedido?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Nossa equipe está pronta para te ajudar com qualquer questão
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span>📧 suporte@marketplace3d.com</span>
              <span>📱 (11) 99999-9999</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}