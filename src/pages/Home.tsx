import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, Reservation } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import StatusCard from '@/components/StatusCard';
import ReservationForm from '@/components/ReservationForm';
import ReservationsList from '@/components/ReservationsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Package, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const [showReservationForm, setShowReservationForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: reservations = [], isLoading, refetch } = useQuery({
    queryKey: ['reservations'],
    queryFn: api.getReservations,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleCancelReservation = (id: number) => {
    // In a real app, this would call an API to cancel
    toast({
      title: 'Reservation Cancelled',
      description: `Reservation #${id} has been cancelled.`,
    });
    refetch();
  };

  // Filter reservations by status
  const pendingDrop = reservations.filter(
    (r: Reservation) => !r.drop_validated && r.status?.toLowerCase() !== 'cancelled'
  );
  const pendingPickup = reservations.filter(
    (r: Reservation) => r.drop_validated && !r.pickup_validated && r.status?.toLowerCase() !== 'cancelled'
  );
  const activeReservations = reservations.filter(
    (r: Reservation) => r.status?.toLowerCase() !== 'cancelled'
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="text-muted-foreground">
            Manage your pod reservations and track your packages
          </p>
        </div>

        {/* Reserve Pod Button */}
        <div className="mb-8 animate-slide-up">
          <Button
            size="lg"
            onClick={() => setShowReservationForm(true)}
            className="gradient-primary shadow-glow hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
          >
            <Plus className="h-5 w-5 mr-2" />
            Reserve Pod
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Pending Drop Section */}
          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pending Drop</CardTitle>
                  <CardDescription>Awaiting drop-off validation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : pendingDrop.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending drop-offs</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDrop.slice(0, 3).map((res: Reservation) => (
                    <StatusCard
                      key={res.id}
                      podId={res.pod_id || res.id}
                      location={res.location || 'Unknown Location'}
                      time={res.created_at ? format(new Date(res.created_at), 'MMM dd, HH:mm') : 'N/A'}
                      status="pending_drop"
                      dropOtp={res.drop_otp}
                      pickupOtp={res.pickup_otp}
                      dropValidated={res.drop_validated}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Pickup Section */}
          <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pending Pickup</CardTitle>
                  <CardDescription>Ready for pickup</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : pendingPickup.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pending pickups</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPickup.slice(0, 3).map((res: Reservation) => (
                    <StatusCard
                      key={res.id}
                      podId={res.pod_id || res.id}
                      location={res.location || 'Unknown Location'}
                      time={res.created_at ? format(new Date(res.created_at), 'MMM dd, HH:mm') : 'N/A'}
                      status="pending_pickup"
                      dropOtp={res.drop_otp}
                      pickupOtp={res.pickup_otp}
                      dropValidated={res.drop_validated}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              All Reservations
            </CardTitle>
            <CardDescription>
              View and manage all your pod reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="active">Active ({activeReservations.length})</TabsTrigger>
                <TabsTrigger value="all">All ({reservations.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                <ReservationsList
                  reservations={activeReservations}
                  onCancel={handleCancelReservation}
                  isLoading={isLoading}
                />
              </TabsContent>
              <TabsContent value="all">
                <ReservationsList
                  reservations={reservations}
                  onCancel={handleCancelReservation}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Reservation Form Modal */}
        <ReservationForm
          open={showReservationForm}
          onOpenChange={setShowReservationForm}
        />
      </div>
    </Layout>
  );
};

export default Home;
