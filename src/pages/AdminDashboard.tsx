import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { Package, ShoppingCart, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const acceptedOrders = orders.filter(o => o.status === 'accepted' || o.status === 'preparing').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.total), 0);

  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      title: 'Commandes en attente',
      value: pendingOrders,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'En préparation',
      value: acceptedOrders,
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Terminées',
      value: completedOrders,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Revenus totaux',
      value: `${totalRevenue.toLocaleString()} GNF`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'En attente',
      accepted: 'Acceptée',
      preparing: 'En préparation',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre restaurant</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="card-restaurant">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {ordersLoading ? '...' : stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders & Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="card-restaurant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Commandes récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <p className="text-muted-foreground">Chargement...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-muted-foreground">Aucune commande pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{Number(order.total).toLocaleString()} GNF</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products Summary */}
          <Card className="card-restaurant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <p className="text-muted-foreground">Chargement...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="text-muted-foreground">Total produits</span>
                    <span className="text-2xl font-bold">{products.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="text-muted-foreground">Disponibles</span>
                    <span className="text-2xl font-bold text-green-600">
                      {products.filter(p => p.is_available).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <span className="text-muted-foreground">Indisponibles</span>
                    <span className="text-2xl font-bold text-red-600">
                      {products.filter(p => !p.is_available).length}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
