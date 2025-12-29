import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Pod, Location } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Package, MapPin } from 'lucide-react';

interface ReservationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({ open, onOpenChange }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPod, setSelectedPod] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: api.getLocations,
  });

  const { data: pods = [], isLoading: podsLoading } = useQuery({
    queryKey: ['pods'],
    queryFn: api.getPods,
  });

  const createReservation = useMutation({
    mutationFn: api.createReservation,
    onSuccess: () => {
      toast({
        title: 'Reservation Created!',
        description: 'Your pod has been reserved successfully. OTP will be sent to your mobile.',
      });
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      onOpenChange(false);
      setSelectedLocation('');
      setSelectedPod('');
    },
    onError: () => {
      toast({
        title: 'Reservation Failed',
        description: 'Unable to create reservation. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || !selectedPod) {
      toast({
        title: 'Missing Information',
        description: 'Please select both location and pod.',
        variant: 'destructive',
      });
      return;
    }

    createReservation.mutate({
      location_id: parseInt(selectedLocation),
      pod_id: parseInt(selectedPod),
      user_id: user?.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Reserve a Pod
          </DialogTitle>
          <DialogDescription>
            Select your preferred location and available pod to make a reservation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Location Select */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Location
            </Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locationsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  locations.map((location: Location) => (
                    <SelectItem key={location.id} value={String(location.id)}>
                      {location.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Pod Select */}
          <div className="space-y-2">
            <Label htmlFor="pod" className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              Pod
            </Label>
            <Select value={selectedPod} onValueChange={setSelectedPod}>
              <SelectTrigger id="pod">
                <SelectValue placeholder="Select a pod" />
              </SelectTrigger>
              <SelectContent>
                {podsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  pods.map((pod: Pod) => (
                    <SelectItem key={pod.id} value={String(pod.id)}>
                      Pod #{pod.pod_id || pod.id}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary"
              disabled={createReservation.isPending}
            >
              {createReservation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reserving...
                </>
              ) : (
                'Reserve Pod'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationForm;
