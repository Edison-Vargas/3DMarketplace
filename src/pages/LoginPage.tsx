import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: "Erro",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  const handleDemoLogin = (userType: 'buyer' | 'seller') => {
    const demoCredentials = {
      buyer: { email: 'maria.designer@email.com', password: '123456' },
      seller: { email: 'fabricio.3d@email.com', password: '123456' }
    };
    
    setEmail(demoCredentials[userType].email);
    setPassword(demoCredentials[userType].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Entre na sua <span className="gradient-text">conta</span>
          </h2>
          <p className="mt-2 text-muted-foreground">
            Ou{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors">
              crie uma conta gratuita
            </Link>
          </p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="glass border-border/50"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass border-border/50"
                  required
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
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Contas de demonstração</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="glass border-border/50"
                  onClick={() => handleDemoLogin('buyer')}
                >
                  Demo Comprador
                </Button>
                <Button
                  variant="outline"
                  className="glass border-border/50"
                  onClick={() => handleDemoLogin('seller')}
                >
                  Demo Vendedor
                </Button>
              </div>

              <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
                <p>
                  <strong>Comprador:</strong> maria.designer@email.com / 123456
                </p>
                <p>
                  <strong>Vendedor:</strong> fabricio.3d@email.com / 123456
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}