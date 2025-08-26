import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, MessageCircle, ShoppingCart, MapPin, Clock, Package, Truck, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThreeDPreview } from '@/components/ThreeDPreview';
import { mockProducts } from '@/lib/mockData';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Button onClick={() => navigate('/catalog')}>
            Voltar ao Catálogo
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para adicionar produtos ao carrinho.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${Date.now()}-${i}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        printType: product.printType,
        material: product.material,
        color: selectedColor
      });
    }

    toast({
      title: "Produto adicionado!",
      description: `${quantity}x ${product.name} adicionado${quantity > 1 ? 's' : ''} ao seu carrinho.`,
    });
  };

  const handleContactSeller = () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para contatar vendedores.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    navigate('/messages', { 
      state: { 
        sellerId: product.sellerId, 
        sellerName: product.sellerName,
        productName: product.name 
      } 
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite 
        ? "Produto removido da sua lista de favoritos."
        : "Produto adicionado à sua lista de favoritos.",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/catalog')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao catálogo
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images & 3D Preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden glass">
              <img 
                src={product.images[selectedImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-3d')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'fallback-3d w-full h-full flex items-center justify-center';
                    fallback.innerHTML = `
                      <svg class="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                    `;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFavorite}
                  className="p-2"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviews.length} avaliação{product.reviews.length !== 1 ? 'ões' : ''})
                  </span>
                </div>
                {product.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                    Destaque
                  </Badge>
                )}
              </div>

              <p className="text-4xl font-bold gradient-text mb-6">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>

              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>

            {/* Product Specifications */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Especificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Impressão:</span>
                  <Badge variant="outline">{product.printType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material:</span>
                  <span>{product.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensões:</span>
                  <span>{product.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo de Impressão:</span>
                  <span>{product.printTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categoria:</span>
                  <span>{product.category}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customization Options */}
            <div className="space-y-4">
              {product.colors.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Cor:</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="glass border-border/50">
                      <SelectValue placeholder="Selecione uma cor" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium mb-2 block">Quantidade:</Label>
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                  <SelectTrigger className="glass border-border/50 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 btn-hero"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
              <Button 
                variant="outline" 
                className="glass border-border/50"
                onClick={handleContactSeller}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contatar Vendedor
              </Button>
            </div>

            {/* Seller Info */}
            <Card className="glass border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{product.sellerName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{product.sellerName}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{product.sellerRating}</span>
                      <span>•</span>
                      <span>Vendedor verificado</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleContactSeller}>
                    Conversar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Guarantees */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-primary" />
                <span>Frete calculado no checkout</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span>Compra protegida</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="h-4 w-4 text-primary" />
                <span>Produto feito sob demanda</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              Avaliações <span className="gradient-text">({product.reviews.length})</span>
            </h2>
            
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <Card key={review.id} className="glass border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{review.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.userName}</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-muted-foreground'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                        {review.images && review.images.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {review.images.map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt={`Review ${index + 1}`}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}