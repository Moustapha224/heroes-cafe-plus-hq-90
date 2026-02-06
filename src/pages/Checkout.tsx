import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, User, FileText, Truck, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OrderType, PaymentMethod } from '@/types/database';
import LocationPicker from '@/components/checkout/LocationPicker';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    orderType: 'delivery' as OrderType,
    paymentMethod: 'cash' as PaymentMethod,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' GNF';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer votre nom', variant: 'destructive' });
      return false;
    }
    if (!formData.customerPhone.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer votre numéro de téléphone', variant: 'destructive' });
      return false;
    }
    if (formData.orderType === 'delivery' && !formData.customerAddress.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer votre adresse de livraison', variant: 'destructive' });
      return false;
    }
    if (items.length === 0) {
      toast({ title: 'Erreur', description: 'Votre panier est vide', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create order in database
      const orderData = await createOrder.mutateAsync({
        customer_name: formData.customerName.trim(),
        customer_phone: formData.customerPhone.trim(),
        customer_address: formData.orderType === 'delivery' ? formData.customerAddress.trim() : null,
        order_type: formData.orderType,
        payment_method: formData.paymentMethod,
        items: items,
        subtotal: getSubtotal(),
        total: getTotal(),
        notes: formData.notes.trim() || null,
      });

      // Send email to kitchen
      try {
        await supabase.functions.invoke('send-kitchen-order', {
          body: {
            order: orderData,
            items: items,
          },
        });
      } catch (emailError) {
        console.error('Failed to send kitchen email:', emailError);
        // Don't fail the order if email fails
      }

      clearCart();
      navigate('/order-success', { state: { orderNumber: orderData.order_number } });
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la commande. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link to="/menu" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Menu</span>
            </Link>
            <h1 className="text-xl font-bold text-primary mx-auto">Commande</h1>
            <div className="w-20"></div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-6">Votre panier est vide.</p>
          <Link to="/menu">
            <Button>Voir le menu</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/cart" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Panier</span>
          </Link>
          <h1 className="text-xl font-bold text-primary mx-auto">Finaliser</h1>
          <div className="w-20"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Nom complet *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Téléphone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    placeholder="+224 XXX XXX XXX"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Type */}
          <Card>
            <CardHeader>
              <CardTitle>Type de commande</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.orderType}
                onValueChange={(value) => handleInputChange('orderType', value)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                  <Label
                    htmlFor="delivery"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-colors"
                  >
                    <Truck className="h-6 w-6 mb-2" />
                    Livraison
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                  <Label
                    htmlFor="pickup"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-colors"
                  >
                    <Store className="h-6 w-6 mb-2" />
                    À emporter
                  </Label>
                </div>
              </RadioGroup>

              {formData.orderType === 'delivery' && (
                <div className="mt-4">
                  <LocationPicker
                    value={formData.customerAddress}
                    onChange={(address) => handleInputChange('customerAddress', address)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Mode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange('paymentMethod', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex-1 cursor-pointer">
                    💵 Espèces à la livraison
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="mobile_money" id="mobile_money" />
                  <Label htmlFor="mobile_money" className="flex-1 cursor-pointer">
                    📱 Mobile Money (Orange Money / MTN Money)
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes (optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Instructions spéciales, allergies, etc."
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map(item => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.name}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(getTotal())}</span>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Envoi en cours...' : 'Confirmer la commande'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
