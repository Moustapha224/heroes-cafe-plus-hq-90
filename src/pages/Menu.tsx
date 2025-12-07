import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductsByCategory } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/database';

const Menu = () => {
  const { productsByCategory, isLoading } = useProductsByCategory();
  const { addItem, getItemCount } = useCart();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getQuantity = (productId: string) => quantities[productId] || 1;

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = getQuantity(product.id);
    addItem(product, qty);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
    toast({
      title: 'Ajouté au panier',
      description: `${qty}x ${product.name}`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' GNF';
  };

  const categories = Object.keys(productsByCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          <h1 className="text-xl font-bold text-primary">Notre Menu</h1>
          <Link to="/cart" className="relative">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {getItemCount() > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {getItemCount()}
              </Badge>
            )}
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map(category => (
              <section key={category}>
                <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsByCategory[category].map((product: Product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Pas d'image
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                          <span className="text-primary font-bold whitespace-nowrap ml-2">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 border border-border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {getQuantity(product.id)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(product.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            className="flex-1"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Ajouter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Floating Cart Button */}
      {getItemCount() > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Link to="/cart">
            <Button size="lg" className="shadow-lg px-8">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Voir le panier ({getItemCount()})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
