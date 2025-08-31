'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Crown, Users, Clock, Share, Settings, AlertTriangle } from 'lucide-react';
import { RoomPickTab } from '@/components/rooms/room-pick-tab';
import { RoomPlayersTab } from '@/components/rooms/room-players-tab';
import { RoomTimelineTab } from '@/components/rooms/room-timeline-tab';
import { RoomSettingsTab } from '@/components/rooms/room-settings-tab';
import { DealBanner } from '@/components/rooms/deal-banner';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading room data
    const loadRoom = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoom({
        id: params.id,
        name: 'Elite Survivors',
        host: 'FootballKing',
        isHost: true,
        pot: 22500,
        playersLeft: 12,
        totalStarters: 45,
        currentGameweek: 15,
        lockCountdown: '2d 14h 23m',
        hasDeal: true,
        visibility: 'public',
        inviteCode: 'ABC12345',
      });
      setIsLoading(false);
    };

    loadRoom();
  }, [params.id]);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-luxury-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Room Not Found</h2>
          <p className="text-muted-foreground">This room may have been deleted or you don't have access.</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-gradient">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="mt-1 hover:bg-muted/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-display font-bold">{room.name}</h1>
                  {room.visibility === 'private' && (
                    <Badge variant="outline" className="border-border/50">
                      Private
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-muted text-xs">
                        {room.host.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>Hosted by {room.host}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{room.playersLeft} of {room.totalStarters} remaining</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="border-border/50">
                <Share className="w-4 h-4" />
              </Button>
              {room.isHost && (
                <Button variant="outline" size="icon" className="border-border/50">
                  <Settings className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Deal Banner */}
      {room.hasDeal && (
        <DealBanner
          roomId={room.id}
          dealType="split"
          requiredPlayers={room.playersLeft}
          acceptedCount={0}
        />
      )}

      {/* Room Stats */}
      <div className="border-b border-border/50 bg-card/20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-luxury-gold" />
                <span className="text-sm text-muted-foreground">Prize Pool</span>
              </div>
              <div className="text-2xl font-bold text-luxury-gold">
                {formatCurrency(room.pot)}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Survivors</span>
              </div>
              <div className="text-2xl font-bold">
                {room.playersLeft}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-sm text-muted-foreground">Gameweek</span>
              </div>
              <div className="text-2xl font-bold text-luxury-emerald">
                {room.currentGameweek}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-destructive" />
                <span className="text-sm text-muted-foreground">Lock In</span>
              </div>
              <div className="text-lg font-mono font-bold text-destructive animate-countdown-pulse">
                {room.lockCountdown}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pick" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border/50">
            <TabsTrigger value="pick" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black">
              Pick
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black">
              Players
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black">
              Timeline
            </TabsTrigger>
            {room.isHost && (
              <TabsTrigger value="settings" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black">
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="pick">
            <RoomPickTab room={room} />
          </TabsContent>
          
          <TabsContent value="players">
            <RoomPlayersTab room={room} />
          </TabsContent>
          
          <TabsContent value="timeline">
            <RoomTimelineTab room={room} />
          </TabsContent>
          
          {room.isHost && (
            <TabsContent value="settings">
              <RoomSettingsTab room={room} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}