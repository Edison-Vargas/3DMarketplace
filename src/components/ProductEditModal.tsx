import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  X, 
  Package,
  DollarSign,
  Palette,
  Settings,
  Save
} from 'lucide-react';
import { Product, categories, printTypes } from '@/lib/mockData';

const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
  category: z.string().min(1, 'Selecione uma categoria'),
  printType: z.enum(['FDM', 'SLA', 'SLS']),
  material: z.string().min(1, 'Material é obrigatório'),
  dimensions: z.string().min(1, 'Dimensões são obrigatórias'),
  printTime: z.string().min(1, 'Tempo de impressão é obrigatório'),
  colors: z.array(z.string()).min(1, 'Selecione pelo menos uma cor'),
  featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

const availableColors = [
  'Branco', 'Preto', 'Cinza', 'Vermelho', 'Azul', 'Verde', 
  'Amarelo', 'Laranja', 'Rosa', 'Roxo', 'Marrom', 'Dourado', 'Prateado'
];

const materials = [
  'PLA', 'ABS', 'PETG', 'TPU', 'Resina Fotopolimérica', 
  'Nylon PA12', 'Wood Fill', 'Metal Fill', 'Carbon Fiber'
];

interface ProductEditModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedProduct: Product) => void;
}

export function ProductEditModal({ product, open, onOpenChange, onSave }: ProductEditModalProps) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      printType: 'FDM',
      material: '',
      dimensions: '',
      printTime: '',
      colors: [],
      featured: false,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        printType: product.printType as 'FDM' | 'SLA' | 'SLS',
        material: product.material,
        dimensions: product.dimensions,
        printTime: product.printTime,
        colors: product.colors,
        featured: product.featured || false,
      });
      setSelectedColors(product.colors);
    }
  }, [product, form]);

  const onSubmit = (data: ProductFormData) => {
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      ...data,
      colors: selectedColors,
    };

    onSave(updatedProduct);
    
    toast({
      title: "Produto atualizado!",
      description: `${data.name} foi atualizado com sucesso.`,
    });

    onOpenChange(false);
  };

  const addColor = (color: string) => {
    if (!selectedColors.includes(color)) {
      const newColors = [...selectedColors, color];
      setSelectedColors(newColors);
      form.setValue('colors', newColors);
    }
  };

  const removeColor = (color: string) => {
    const newColors = selectedColors.filter(c => c !== color);
    setSelectedColors(newColors);
    form.setValue('colors', newColors);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Editar Produto
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do seu produto
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Informações Básicas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Dragão Místico - Miniatura RPG" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            className="pl-10"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva seu produto de forma detalhada..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Especificações Técnicas
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.filter(c => c !== 'Todos').map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="printType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Impressão</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {printTypes.filter(p => p !== 'Todos').map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem key={material} value={material}>
                              {material}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensões</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 10cm x 8cm x 5cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="printTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo de Impressão</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 4 horas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Cores Disponíveis
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant={selectedColors.includes(color) ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectedColors.includes(color) ? removeColor(color) : addColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
              
              {selectedColors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedColors.map((color) => (
                    <Badge key={color} variant="secondary" className="flex items-center gap-1">
                      {color}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeColor(color)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Option */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Produto em Destaque
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque para destacar este produto na página inicial
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </Button>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}