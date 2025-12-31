import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Location } from "@/lib/api";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Loader2 } from "lucide-react";

const Locations: React.FC = () => {
  const { data: locations = [], isLoading } = useQuery({
    queryKey: ["locations"],
    queryFn: api.getLocations,
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Locations</h1>
          <p className="text-muted-foreground">Find available pod locations near you</p>
        </div>

        {/* Locations Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : locations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Locations Available</h3>
              <p className="text-sm text-muted-foreground">Locations will appear here once configured.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location: Location, index: number) => (
              <Card
                key={location.id}
                className="group hover:shadow-elevated transition-all duration-300 animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Color bar */}
                <div className="h-2 gradient-primary rounded-t-lg" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{location.location_name}</CardTitle>
                        {location.location_state && (
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {location.location_pincode ? `${location.location_pincode}, ` : ""}
                            {location.location_state}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <Badge variant="success" className="shrink-0">
                      Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {location.location_address && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{location.location_address}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Locations;
