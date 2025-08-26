import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  X, 
  Plus,
  Package,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Palette,
  Settings
} from 'lucide-react';
import { categories, printTypes } from '@/lib/mockData';

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
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  downloadable: z.boolean().default(false),
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

export function ProductForm() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

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
      tags: [],
      featured: false,
      downloadable: false,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    // Simulate product creation
    const newProduct = {
      ...data,
      id: Date.now().toString(),
      colors: selectedColors,
      tags: tags,
      images: imageFiles.map(file => URL.createObjectURL(file)),
      sellerId: '2', // Current user ID
      sellerName: 'Ricardo Almeida',
      sellerRating: 4.8,
      rating: 0,
      reviews: [],
    };

    console.log('New Product:', newProduct);
    
    toast({
      title: "Produto cadastrado com sucesso!",
      description: `${data.name} foi adicionado ao seu catálogo.`,
    });

    // Reset form
    form.reset();
    setSelectedColors([]);
    setTags([]);
    setImageFiles([]);
  };

  const addColor = (color: string) => {
    if (!selectedColors.includes(color)) {
      setSelectedColors([...selectedColors, color]);
      form.setValue('colors', [...selectedColors, color]);
    }
  };

  const removeColor = (color: string) => {
    const newColors = selectedColors.filter(c => c !== color);
    setSelectedColors(newColors);
    form.setValue('colors', newColors);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Cadastrar Novo Produto
          </CardTitle>
          <CardDescription>
            Preencha as informações do seu produto para adicioná-lo ao marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Informações Básicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Uma boa descrição ajuda os compradores a entender melhor seu produto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Technical Specifications */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Especificações Técnicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Imagens do Produto
                </h3>
                
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  
                  {imageFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {imageFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Adicionar tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Adicionar
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
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
                          <FormLabel>Produto em Destaque</FormLabel>
                          <FormDescription>
                            Produtos em destaque aparecem nas primeiras posições
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="downloadable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Arquivo Para Download</FormLabel>
                          <FormDescription>
                            Cliente pode baixar o arquivo STL/modelo 3D
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full btn-hero" size="lg">
                Cadastrar Produto
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}