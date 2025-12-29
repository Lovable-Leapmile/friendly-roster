import React from 'react';
import { format } from 'date-fns';
import { Trash2, Package, MapPin, Calendar, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Reservation } from '@/lib/api';

interface ReservationsListProps {
  reservations: Reservation[];
  onCancel: (id: number) => void;
  isLoading?: boolean;
}

const ReservationsList: React.FC<ReservationsListProps> = ({
  reservations,
  onCancel,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Reservations Yet</h3>
          <p className="text-sm text-muted-foreground">
            Reserve a pod to see your reservations here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {reservations.map((reservation, index) => (
        <Card
          key={reservation.id}
          className="overflow-hidden animate-slide-up hover:shadow-elevated transition-all duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Pod ID & Status */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      Pod #{reservation.pod_id || reservation.id}
                    </span>
                  </div>
                  <Badge variant={getStatusColor(reservation.status)}>
                    {reservation.status || 'Active'}
                  </Badge>
                </div>

                {/* Location */}
                {reservation.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{reservation.location}</span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {reservation.created_at
                      ? format(new Date(reservation.created_at), 'MMM dd, yyyy • HH:mm')
                      : 'N/A'}
                  </span>
                </div>

                {/* OTP Section */}
                <div className="flex gap-6 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Drop OTP</p>
                      <p className="font-mono font-semibold text-foreground">
                        {reservation.drop_otp || '----'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {reservation.drop_validated ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup OTP</p>
                      <p className="font-mono font-semibold text-foreground">
                        {reservation.drop_validated
                          ? reservation.pickup_otp || '----'
                          : '******'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              {reservation.status?.toLowerCase() !== 'cancelled' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel(reservation.id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReservationsList;
