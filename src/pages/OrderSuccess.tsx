import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const OrderSuccess = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;

  if (!orderNumber) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Commande confirmée !
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Merci pour votre commande. Nous préparons vos plats avec soin.
          </p>

          <div className="bg-muted rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Numéro de commande</p>
            <p className="text-xl font-bold text-primary">{orderNumber}</p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Vous recevrez un appel pour confirmer votre commande et le délai de livraison estimé.
          </p>

          <div className="flex flex-col gap-3">
            <Link to="/menu">
              <Button className="w-full" variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Commander à nouveau
              </Button>
            </Link>
            <Link to="/">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSuccess;
