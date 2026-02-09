import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Users, Clock, Filter } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useReservations, useUpdateReservationStatus, Reservation } from '@/hooks/useReservations';
import { Loader2 } from 'lucide-react';

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  completed: 'Terminée',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300',
  completed: 'bg-blue-100 text-blue-800 border-blue-300',
};

const AdminReservations = () => {
  const { data: reservations, isLoading } = useReservations();
  const updateStatus = useUpdateReservationStatus();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = reservations?.filter(r =>
    statusFilter === 'all' ? true : r.status === statusFilter
  ) ?? [];

  const counts = {
    total: reservations?.length ?? 0,
    pending: reservations?.filter(r => r.status === 'pending').length ?? 0,
    confirmed: reservations?.filter(r => r.status === 'confirmed').length ?? 0,
    today: reservations?.filter(r => r.reservation_date === format(new Date(), 'yyyy-MM-dd')).length ?? 0,
  };

  const handleStatusChange = (id: string, status: Reservation['status']) => {
    updateStatus.mutate({ id, status });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-heading font-bold">Réservations</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{counts.total}</p><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-yellow-600">{counts.pending}</p><p className="text-sm text-muted-foreground">En attente</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-green-600">{counts.confirmed}</p><p className="text-sm text-muted-foreground">Confirmées</p></CardContent></Card>
          <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-primary">{counts.today}</p><p className="text-sm text-muted-foreground">Aujourd'hui</p></CardContent></Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
              <SelectItem value="completed">Terminées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Aucune réservation trouvée.</CardContent></Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Personnes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-sm">{r.reservation_number}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{r.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{r.customer_email}</p>
                          {r.customer_phone && <p className="text-xs text-muted-foreground">{r.customer_phone}</p>}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(r.reservation_date), 'dd MMM yyyy', { locale: fr })}</TableCell>
                      <TableCell>{r.reservation_time}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> {r.party_size}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[r.status] ?? ''}>
                          {statusLabels[r.status] ?? r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={r.status}
                          onValueChange={(val) => handleStatusChange(r.id, val as Reservation['status'])}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                            <SelectItem value="completed">Terminée</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;
