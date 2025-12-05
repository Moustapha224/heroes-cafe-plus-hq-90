import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { Order, OrderStatus } from '@/types/database';
import { Eye, Loader2, Phone, MapPin, CreditCard, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminOrders = () => {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      pending: { label: 'En attente', variant: 'warning' as const, className: 'bg-yellow-100 text-yellow-800' },
      accepted: { label: 'Acceptée', variant: 'info' as const, className: 'bg-blue-100 text-blue-800' },
      preparing: { label: 'En préparation', variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Terminée', variant: 'success' as const, className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config[status].className}`}>
        {config[status].label}
      </span>
    );
  };

  const getOrderTypeLabel = (type: string) => {
    return type === 'delivery' ? '🚚 Livraison' : '🏪 À emporter';
  };

  const getPaymentLabel = (method: string) => {
    const labels = {
      cash: 'Espèces',
      mobile_money: 'Mobile Money',
      card: 'Carte bancaire',
    };
    return labels[method as keyof typeof labels] || method;
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateStatus.mutateAsync({ id: orderId, status: newStatus });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Commandes</h1>
            <p className="text-muted-foreground mt-1">Gérez les commandes de vos clients</p>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les commandes</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="accepted">Acceptées</SelectItem>
              <SelectItem value="preparing">En préparation</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="card-restaurant">
          <CardHeader>
            <CardTitle>Liste des commandes ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucune commande trouvée.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Commande</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getOrderTypeLabel(order.order_type)}</TableCell>
                      <TableCell className="font-semibold">
                        {Number(order.total).toLocaleString()} GNF
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue>{getStatusBadge(order.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="accepted">Acceptée</SelectItem>
                            <SelectItem value="preparing">En préparation</SelectItem>
                            <SelectItem value="completed">Terminée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(order.created_at), 'dd MMM HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Commande {selectedOrder?.order_number}
                {selectedOrder && getStatusBadge(selectedOrder.status)}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold">Informations client</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Nom:</span>
                      <span className="font-medium">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedOrder.customer_phone}</span>
                    </div>
                    {selectedOrder.customer_address && (
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedOrder.customer_address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span>{getPaymentLabel(selectedOrder.payment_method)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(selectedOrder.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-3">Articles commandés</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} x {Number(item.price).toLocaleString()} GNF
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold">
                          {(item.quantity * item.price).toLocaleString()} GNF
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{Number(selectedOrder.total).toLocaleString()} GNF</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-1">Notes</h3>
                    <p className="text-yellow-700">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
