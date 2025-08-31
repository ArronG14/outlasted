'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    pot: number;
    playersLeft: number;
    totalStarters: number;
    nextGameweek: number;
    lockCountdown: string;
    userPick: string | null;
    hasDeal: boolean;
  };
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <Card 
      className="group bg-card/80 backdrop-blur-sm border-border/50 hover:border-luxury-gold/50 transition-all duration-300 hover:shadow-luxury cursor-pointer animate-fade-in"
      onClick={() => router.push(`/rooms/${room.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-semibold group-hover:text-luxury-gold transition-colors">
              {room.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{room.playersLeft} of {room.totalStarters} left</span>
            </div>
          </div>
          {room.hasDeal && (
            <Badge className="bg-luxury-emerald text-white font-semibold">
              Deal Available
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pot */}
        <div className="flex items-center justify-between p-3 bg-luxury-gradient rounded-xl border border-border/30">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-luxury-gold" />
            <span className="text-sm font-medium">Prize Pool</span>
          </div>
          <span className="text-lg font-bold text-luxury-gold">
            {formatCurrency(room.pot)}
          </span>
        </div>

        {/* Gameweek & Lock */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gameweek {room.nextGameweek}</span>
            <div className="flex items-center gap-1 text-destructive">
              <Clock className="w-3 h-3" />
              <span className="font-mono font-semibold animate-countdown-pulse">
                {room.lockCountdown}
              </span>
            </div>
          </div>
        </div>

        {/* User Pick Status */}
        <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30">
          {room.userPick ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-luxury-emerald" />
              <span className="text-sm">Picked: <span className="font-semibold">{room.userPick}</span></span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm">No pick selected</span>
            </div>
          )}
          
          <Button 
            size="sm" 
            variant={room.userPick ? "outline" : "default"}
            className={room.userPick 
              ? "border-border/50 hover:border-luxury-gold text-xs" 
              : "bg-emerald-gradient hover:opacity-90 text-black font-semibold text-xs"
            }
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/rooms/${room.id}?tab=pick`);
            }}
          >
            {room.userPick ? 'Change' : 'Pick Now'}
          </Button>
        </div>

        {/* Survival Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Survival Rate</span>
            <span>{Math.round((room.playersLeft / room.totalStarters) * 100)}%</span>
          </div>
          <div className="w-full bg-muted/20 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-error to-luxury-emerald h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(room.playersLeft / room.totalStarters) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}