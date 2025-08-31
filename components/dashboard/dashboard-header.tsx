'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Crown, Bell, Wallet, Settings, LogOut, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  user: User;
  userProfile: any;
}

export function DashboardHeader({ user, userProfile }: DashboardHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      router.push('/');
      return;
    }
    
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-luxury-gold" />
            <span className="text-sm font-semibold text-luxury-gold">
              OUTLASTED
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Earnings */}
            <div className="hidden sm:flex items-center gap-2 bg-card/50 rounded-full px-4 py-2 border border-border/50">
              <Wallet className="w-4 h-4 text-gold-luxe" />
              <span className="text-sm font-semibold text-gold-luxe">
                {formatCurrency(userProfile.total_earnings_cents)}
              </span>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-destructive text-xs">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-luxury-gold/20">
                    <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
                    <AvatarFallback className="bg-luxury-gold text-black font-semibold">
                      {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border/50">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile.avatar_url} alt={userProfile.name} />
                    <AvatarFallback className="bg-luxury-gold text-black text-xs">
                      {userProfile.username?.charAt(0)?.toUpperCase() || userProfile.first_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userProfile.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="sm:hidden">
                  <Wallet className="w-4 h-4 mr-2" />
                  <span>Earnings: {formatCurrency(userProfile.total_earnings_cents)}</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span>Tutorial</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}