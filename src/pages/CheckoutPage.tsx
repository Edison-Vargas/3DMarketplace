import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MapPin, CreditCard, Banknote, Smartphone, ShieldCheck, Truck, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Address {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  days: string;
  description: string;
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [selectedShipping, setSelectedShipping] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock shipping options
  const shippingOptions: ShippingOption[] = [
    {
      id: 'standard',
      name: 'Entrega Padrão',
      price: 15.90,
      days: '7-10 dias úteis',
      description: 'Entrega econômica via Correios'
    },
    {
      id: 'express',
      name: 'Entrega Expressa',
      price: 29.90,
      days: '3-5 dias úteis',
      description: 'Entrega rápida via transportadora'
    },
    {
      id: 'premium',
      name: 'Entrega Premium',
      price: 49.90,
      days: '1-2 dias úteis',
      description: 'Entrega ultra rápida com seguro'
    }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, items, navigate]);

  // Auto-fill address based on zipCode (simulated)
  const handleZipCodeChange = (zipCode: string) => {
    setAddress(prev => ({ ...prev, zipCode }));
    
    if (zipCode.length === 8) {
      // Simulate API call for address lookup
      setTimeout(() => {
        setAddress(prev => ({
          ...prev,
          street: 'Rua das Flores',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP'
        }));
        toast({
          title: "Endereço encontrado!",
          description: "CEP validado com sucesso.",
        });
      }, 1000);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const orderNumber = `MP3D${Date.now()}`;
    
    // Store order in localStorage (simulating database)
    const order = {
      id: orderNumber,
      items,
      address,
      shipping: shippingOptions.find(s => s.id === selectedShipping),
      paymentMethod,
      total: total + (shippingOptions.find(s => s.id === selectedShipping)?.price || 0),
      status: 'confirmed',
      date: new Date().toISOString(),
      userId: user?.id
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('marketplace3d_orders') || '[]');
    localStorage.setItem('marketplace3d_orders', JSON.stringify([...existingOrders, order]));
    
    clearCart();
    setIsProcessing(false);
    
    toast({
      title: "Compra realizada com sucesso! 🎉",
      description: `Pedido ${orderNumber} confirmado.`,
    });
    
    navigate('/order-success', { state: { orderNumber } });
  };

  const selectedShippingOption = shippingOptions.find(s => s.id === selectedShipping);
  const finalTotal = total + (selectedShippingOption?.price || 0);

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/cart')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao carrinho
            </Button>
            <h1 className="text-3xl font-bold">
              Finalizar <span className="gradient-text">Compra</span>
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {stepNumber === 1 && 'Endereço'}
                    {stepNumber === 2 && 'Entrega'}
                    {stepNumber === 3 && 'Pagamento'}
                  </span>
                  {stepNumber < 3 && (
                    <div className={`w-20 h-0.5 mx-4 ${
                      step > stepNumber ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Address */}
              {step === 1 && (
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Endereço de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="zipCode">CEP *</Label>
                        <Input
                          id="zipCode"
                          value={address.zipCode}
                          onChange={(e) => handleZipCodeChange(e.target.value)}
                          placeholder="00000-000"
                          maxLength={8}
                          className="glass border-border/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="street">Rua *</Label>
                        <Input
                          id="street"
                          value={address.street}
                          onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                          className="glass border-border/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="number">Número *</Label>
                        <Input
                          id="number"
                          value={address.number}
                          onChange={(e) => setAddress(prev => ({ ...prev, number: e.target.value }))}
                          className="glass border-border/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="complement">Complemento</Label>
                        <Input
                          id="complement"
                          value={address.complement}
                          onChange={(e) => setAddress(prev => ({ ...prev, complement: e.target.value }))}
                          className="glass border-border/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="neighborhood">Bairro *</Label>
                        <Input
                          id="neighborhood"
                          value={address.neighborhood}
                          onChange={(e) => setAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                          className="glass border-border/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          value={address.city}
                          onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                          className="glass border-border/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado *</Label>
                        <Select value={address.state} onValueChange={(value) => setAddress(prev => ({ ...prev, state: value }))}>
                          <SelectTrigger className="glass border-border/50">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      className="w-full btn-hero"
                      onClick={() => setStep(2)}
                      disabled={!address.zipCode || !address.street || !address.number}
                    >
                      Continuar para Entrega
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Opções de Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 glass">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{option.name}</p>
                                  <p className="text-sm text-muted-foreground">{option.description}</p>
                                  <p className="text-sm text-primary">{option.days}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">R$ {option.price.toFixed(2).replace('.', ',')}</p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <div className="flex gap-4 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        className="glass border-border/50"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button 
                        className="flex-1 btn-hero"
                        onClick={() => setStep(3)}
                        disabled={!selectedShipping}
                      >
                        Continuar para Pagamento
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <Card className="glass border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Forma de Pagamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 glass">
                          <RadioGroupItem value="credit" id="credit" />
                          <Label htmlFor="credit" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <CreditCard className="h-5 w-5" />
                              <div>
                                <p className="font-medium">Cartão de Crédito</p>
                                <p className="text-sm text-muted-foreground">Visa, Mastercard, Elo</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 glass">
                          <RadioGroupItem value="debit" id="debit" />
                          <Label htmlFor="debit" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Smartphone className="h-5 w-5" />
                              <div>
                                <p className="font-medium">Cartão de Débito</p>
                                <p className="text-sm text-muted-foreground">Débito online</p>
                              </div>
                            </div>
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2 p-4 rounded-lg border border-border/50 glass">
                          <RadioGroupItem value="boleto" id="boleto" />
                          <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Banknote className="h-5 w-5" />
                              <div>
                                <p className="font-medium">Boleto Bancário</p>
                                <p className="text-sm text-muted-foreground">Vencimento em 3 dias úteis</p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                      <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <Label htmlFor="cardNumber">Número do Cartão *</Label>
                            <Input
                              id="cardNumber"
                              value={cardData.number}
                              onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
                              placeholder="0000 0000 0000 0000"
                              maxLength={19}
                              className="glass border-border/50"
                            />
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="cardName">Nome no Cartão *</Label>
                            <Input
                              id="cardName"
                              value={cardData.name}
                              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Nome como no cartão"
                              className="glass border-border/50"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardExpiry">Validade *</Label>
                            <Input
                              id="cardExpiry"
                              value={cardData.expiry}
                              onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="glass border-border/50"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvv">CVV *</Label>
                            <Input
                              id="cardCvv"
                              value={cardData.cvv}
                              onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                              placeholder="000"
                              maxLength={4}
                              className="glass border-border/50"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Seus dados estão protegidos com criptografia SSL</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(2)}
                        className="glass border-border/50"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar
                      </Button>
                      <Button 
                        className="flex-1 btn-hero"
                        onClick={handlePayment}
                        disabled={!paymentMethod || isProcessing}
                      >
                        {isProcessing ? 'Processando...' : `Finalizar Compra - R$ ${finalTotal.toFixed(2).replace('.', ',')}`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="glass border-border/50 sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                        <p className="text-sm font-medium">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {selectedShippingOption && (
                      <div className="flex justify-between text-sm">
                        <span>Frete</span>
                        <span>R$ {selectedShippingOption.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="gradient-text">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
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