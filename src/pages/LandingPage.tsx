import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Package, Zap, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThreeDPreview } from '@/components/ThreeDPreview';
import heroImage from '@/assets/hero-3d-printer.jpg';
import dragonImage from '@/assets/dragon-miniature.jpg';
import vaseImage from '@/assets/geometric-vase.jpg';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary-glow/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  O Futuro da
                  <span className="gradient-text block">Impressão 3D</span>
                  está aqui
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Conectamos criadores e compradores no maior marketplace de impressão 3D do Brasil. 
                  Encontre produtos únicos ou venda suas criações.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/catalog">
                  <Button size="lg" className="btn-hero group">
                    Explorar Produtos
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="glass border-border/50">
                    Começar a Vender
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">5000+</div>
                  <div className="text-sm text-muted-foreground">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">1200+</div>
                  <div className="text-sm text-muted-foreground">Criadores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">4.9</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    Avaliação
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-3xl blur-3xl" />
              <div className="relative bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-border/50">
                <img 
                  src={heroImage} 
                  alt="Impressão 3D Futurística" 
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="h-16 mb-2">
                      <ThreeDPreview modelType="dragon" color="#6366f1" />
                    </div>
                    <p className="text-sm font-medium">Miniaturas</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <div className="h-16 mb-2">
                      <ThreeDPreview modelType="vase" color="#8b5cf6" />
                    </div>
                    <p className="text-sm font-medium">Decoração</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Para <span className="gradient-text">Todos</span> os Criadores
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Seja você um designer procurando peças únicas ou um maker querendo vender suas criações
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Buyers */}
            <Card className="product-card overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Para Compradores</h3>
                    <p className="text-muted-foreground">Designers, makers e entusiastas</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Produtos Únicos</p>
                      <p className="text-sm text-muted-foreground">Encontre peças exclusivas que não existem em lugar nenhum</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Qualidade Garantida</p>
                      <p className="text-sm text-muted-foreground">Todos os vendedores são verificados e avaliados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Entrega Rápida</p>
                      <p className="text-sm text-muted-foreground">Impressão sob demanda com prazos transparentes</p>
                    </div>
                  </div>
                </div>

                <Link to="/catalog">
                  <Button className="w-full btn-hero">
                    Explorar Produtos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sellers */}
            <Card className="product-card overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Para Vendedores</h3>
                    <p className="text-muted-foreground">Makers, empresas e criadores</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Audiência Qualificada</p>
                      <p className="text-sm text-muted-foreground">Conecte-se com milhares de compradores interessados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Vendas Seguras</p>
                      <p className="text-sm text-muted-foreground">Pagamentos protegidos e garantia de recebimento</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Headphones className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Suporte Completo</p>
                      <p className="text-sm text-muted-foreground">Ferramentas e suporte para fazer seu negócio crescer</p>
                    </div>
                  </div>
                </div>

                <Link to="/register">
                  <Button className="w-full btn-hero">
                    Começar a Vender
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Produtos em <span className="gradient-text">Destaque</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra os produtos mais populares da nossa comunidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="product-card">
              <CardContent className="p-6">
                <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={dragonImage} 
                    alt="Dragão Místico" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-2">Dragão Místico - Miniatura</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Miniatura detalhada para RPG com impressão SLA
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">R$ 45,90</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="product-card">
              <CardContent className="p-6">
                <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={vaseImage} 
                    alt="Vaso Geométrico" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold mb-2">Vaso Decorativo Geométrico</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Design moderno para decoração contemporânea
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">R$ 32,50</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.7</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="product-card">
              <CardContent className="p-6">
                <div className="aspect-square mb-4 bg-muted rounded-lg flex items-center justify-center">
                  <ThreeDPreview modelType="phone-stand" color="#666666" />
                </div>
                <h3 className="font-semibold mb-2">Suporte Smartphone Ajustável</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Ergonômico e funcional para múltiplos ângulos
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold gradient-text">R$ 18,90</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.6</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="glass border-border/50">
                Ver Todos os Produtos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para <span className="gradient-text">Começar</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se à maior comunidade de impressão 3D do Brasil. 
            Crie, venda e compre produtos únicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="btn-hero">
                Criar Conta Gratuita
              </Button>
            </Link>
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="glass border-border/50">
                Explorar Agora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}