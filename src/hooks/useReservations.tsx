import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Reservation {
  id: string;
  reservation_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

interface CreateReservationInput {
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  notes?: string | null;
}

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('reservation_date', { ascending: true });
      
      if (error) throw error;
      return data as Reservation[];
    },
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (reservation: CreateReservationInput) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          reservation_number: 'TEMP',
          customer_name: reservation.customer_name,
          customer_email: reservation.customer_email,
          customer_phone: reservation.customer_phone || null,
          reservation_date: reservation.reservation_date,
          reservation_time: reservation.reservation_time,
          party_size: reservation.party_size,
          notes: reservation.notes || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Reservation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: 'Réservation confirmée',
        description: `Réservation ${data.reservation_number} créée avec succès.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la réservation.',
        variant: 'destructive',
      });
      console.error('Error creating reservation:', error);
    },
  });
};

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Reservation['status'] }) => {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de la réservation a été modifié.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut.',
        variant: 'destructive',
      });
      console.error('Error updating reservation status:', error);
    },
  });
};
