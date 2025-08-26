import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight, User, Store } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'buyer' as 'buyer' | 'seller',
    bio: '',
    location: ''
  });
  
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    const success = await register(formData);
    
    if (success) {
      toast({
        title: "Sucesso!",
        description: "Conta criada com sucesso. Bem-vindo ao Marketplace3D!",
      });
      navigate('/');
    } else {
      toast({
        title: "Erro",
        description: "Este email já está em uso.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Crie sua <span className="gradient-text">conta</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors">
              Faça login
            </Link>
          </p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta gratuita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Seu nome completo"
                  className="glass border-border/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  className="glass border-border/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className="glass border-border/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className="glass border-border/50"
                  required
                />
              </div>

              <div>
                <Label>Tipo de conta *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleChange('type', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg glass border border-border/50">
                    <RadioGroupItem value="buyer" id="buyer" />
                    <Label htmlFor="buyer" className="flex items-center gap-2 cursor-pointer flex-1">
                      <User className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Comprador</p>
                        <p className="text-xs text-muted-foreground">Quero comprar produtos 3D</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg glass border border-border/50">
                    <RadioGroupItem value="seller" id="seller" />
                    <Label htmlFor="seller" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Store className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Vendedor</p>
                        <p className="text-xs text-muted-foreground">Quero vender meus produtos</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Cidade, Estado"
                  className="glass border-border/50"
                />
              </div>

              <div>
                <Label htmlFor="bio">Sobre você</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Conte um pouco sobre você e seus interesses..."
                  className="glass border-border/50"
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full btn-hero"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    Criar conta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}