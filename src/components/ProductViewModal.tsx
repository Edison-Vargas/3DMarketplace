import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package,
  Star,
  Clock,
  Ruler,
  Palette,
  Settings,
  ExternalLink
} from 'lucide-react';
import { Product } from '@/lib/mockData';

interface ProductViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductViewModal({ product, open, onOpenChange }: ProductViewModalProps) {
  if (!product) return null;

  const handleViewPublic = () => {
    window.open(`/product/${product.id}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Visualizar Produto
          </DialogTitle>
          <DialogDescription>
            Prévia de como seu produto aparece para os compradores
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-current" />
                    <span className="text-sm font-medium">
                      {product.rating.toFixed(1)} ({product.reviews.length} avaliações)
                    </span>
                  </div>
                  {product.featured && (
                    <Badge className="bg-warning text-warning-foreground">
                      Em Destaque
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Product Image */}
            <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden border border-border">
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'flex items-center justify-center h-full text-center';
                    placeholder.innerHTML = `
                      <div>
                        <svg class="w-16 h-16 text-muted-foreground mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        <p class="text-sm text-muted-foreground">Imagem do produto</p>
                      </div>
                    `;
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Especificações
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categoria:</span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo de Impressão:</span>
                  <Badge variant="outline">{product.printType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Material:</span>
                  <span className="text-sm font-medium">{product.material}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Ruler className="w-3 h-3" />
                    Dimensões:
                  </span>
                  <span className="text-sm font-medium">{product.dimensions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Tempo de Impressão:
                  </span>
                  <span className="text-sm font-medium">{product.printTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Cores Disponíveis
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <Badge key={color} variant="secondary">
                  {color}
                </Badge>
              ))}
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Vendedor</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{product.sellerName}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning fill-current" />
                    <span>{product.sellerRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleViewPublic} className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Ver Página Pública
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}