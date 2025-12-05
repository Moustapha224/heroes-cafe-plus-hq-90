import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, OrderItem } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Parse items from JSONB
      return data.map(order => ({
        ...order,
        items: (order.items as unknown as OrderItem[]) || [],
      })) as Order[];
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de la commande a été modifié.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut.',
        variant: 'destructive',
      });
      console.error('Error updating order status:', error);
    },
  });
};

interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_address?: string | null;
  order_type: 'delivery' | 'pickup';
  payment_method: 'cash' | 'mobile_money' | 'card';
  items: OrderItem[];
  subtotal: number;
  total: number;
  status?: OrderStatus;
  notes?: string | null;
  user_id?: string | null;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (order: CreateOrderInput) => {
      // The trigger will generate the real order_number
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number: 'TEMP', // Will be overwritten by trigger
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          customer_address: order.customer_address || null,
          order_type: order.order_type,
          payment_method: order.payment_method,
          items: order.items as unknown as Json,
          subtotal: order.subtotal,
          total: order.total,
          status: order.status || 'pending',
          notes: order.notes || null,
          user_id: order.user_id || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Commande créée',
        description: `Commande ${data.order_number} créée avec succès.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la commande.',
        variant: 'destructive',
      });
      console.error('Error creating order:', error);
    },
  });
};
