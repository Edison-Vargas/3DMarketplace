import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, Heart, MessageCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThreeDPreview } from '@/components/ThreeDPreview';
import { mockProducts, categories, printTypes, priceRanges } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPrintType, setSelectedPrintType] = useState('Todos');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Todos');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { addItem } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Print type filter
    if (selectedPrintType !== 'Todos') {
      filtered = filtered.filter(product => product.printType === selectedPrintType);
    }

    // Price range filter
    if (selectedPriceRange !== 'Todos') {
      const priceRange = priceRanges.find(range => range.label === selectedPriceRange);
      if (priceRange) {
        filtered = filtered.filter(product => 
          product.price >= priceRange.min && product.price <= priceRange.max
        );
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
        filtered.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedPrintType, selectedPriceRange, sortBy]);

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para adicionar produtos ao carrinho.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: '/catalog' } } });
      return;
    }

    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      printType: product.printType,
      material: product.material
    });

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleToggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast({
          title: "Removido dos favoritos",
          description: "Produto removido da sua lista de favoritos.",
        });
      } else {
        newFavorites.add(productId);
        toast({
          title: "Adicionado aos favoritos",
          description: "Produto adicionado à sua lista de favoritos.",
        });
      }
      return newFavorites;
    });
  };

  const handleContactSeller = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para contatar vendedores.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: { pathname: '/catalog' } } });
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

  const ProductCard = ({ product }: { product: any }) => (
    <Card 
      className="product-card cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardContent className="p-4">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted relative">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => handleToggleFavorite(product.id, e)}
              className="h-10 w-10 p-0"
            >
              <Heart 
                className={`h-4 w-4 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => handleContactSeller(product, e)}
              className="h-10 w-10 p-0"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="btn-hero h-10 w-10 p-0"
              onClick={(e) => handleAddToCart(product, e)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500">
              Destaque
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline">{product.printType}</Badge>
            <Badge variant="outline">{product.material}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold gradient-text">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviews.length})
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            por {product.sellerName}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Explorar <span className="gradient-text">Produtos</span>
          </h1>
          <p className="text-muted-foreground">
            Descubra produtos únicos de impressão 3D criados por nossa comunidade
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-border/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 glass border-border/50">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPrintType} onValueChange={setSelectedPrintType}>
              <SelectTrigger className="w-40 glass border-border/50">
                <SelectValue placeholder="Tipo de Impressão" />
              </SelectTrigger>
              <SelectContent>
                {printTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
              <SelectTrigger className="w-40 glass border-border/50">
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map(range => (
                  <SelectItem key={range.label} value={range.label}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 glass border-border/50">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="featured">Destaques</SelectItem>
                <SelectItem value="price-low">Menor preço</SelectItem>
                <SelectItem value="price-high">Maior preço</SelectItem>
                <SelectItem value="rating">Melhor avaliado</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* No results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros ou termos de busca</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos');
                setSelectedPrintType('Todos');
                setSelectedPriceRange('Todos');
              }}
              className="glass border-border/50"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
