import React from 'react';
import { MapPin, Clock, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StatusCardProps {
  podId: string | number;
  location: string;
  time: string;
  status: 'pending_drop' | 'pending_pickup';
  dropOtp?: string;
  pickupOtp?: string;
  dropValidated?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  podId,
  location,
  time,
  status,
  dropOtp,
  pickupOtp,
  dropValidated,
}) => {
  const isPendingDrop = status === 'pending_drop';

  return (
    <Card className="overflow-hidden animate-slide-up hover:shadow-elevated transition-all duration-300">
      <div className={`h-1 ${isPendingDrop ? 'bg-warning' : 'bg-success'}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Pod ID */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">Pod #{podId}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>

            {/* OTP Display */}
            <div className="flex gap-4 mt-3 pt-3 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Drop OTP</p>
                <p className="font-mono font-semibold text-foreground">
                  {dropOtp || '----'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pickup OTP</p>
                <p className="font-mono font-semibold text-foreground">
                  {dropValidated ? pickupOtp || '----' : '******'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <Badge
            variant={isPendingDrop ? 'warning' : 'success'}
            className="shrink-0"
          >
            {isPendingDrop ? 'Pending Drop' : 'Pending Pickup'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusCard;
