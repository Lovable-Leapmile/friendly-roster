import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, User, Shield } from 'lucide-react';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user } = useAuth();

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Card */}
        <Card className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/20">
                <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-semibold">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user?.name || 'User'}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  <Shield className="h-3 w-3 mr-1" />
                  Active User
                </Badge>
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{user?.email || 'Not provided'}</p>
                </div>
              </div>

              {/* Phone */}
              {user?.phone && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{user.phone}</p>
                  </div>
                </div>
              )}

              {/* User ID */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium text-foreground">{user?.id || 'N/A'}</p>
                </div>
              </div>

              {/* Member Since */}
              {user?.created_at && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(user.created_at), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
