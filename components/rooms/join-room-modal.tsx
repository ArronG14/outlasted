'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { QrCode, Search, Users, Crown, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Mock room data
  const publicRooms = [
    {
      id: '1',
      name: 'Weekend Warriors',
      playersJoined: 23,
      maxPlayers: 40,
      buyIn: 2500,
      startGameweek: 16,
      host: 'MatchMaster',
      timeLeft: '2d 14h',
    },
    {
      id: '2',
      name: 'Premier Predictions',
      playersJoined: 15,
      maxPlayers: 25,
      buyIn: 5000,
      startGameweek: 17,
      host: 'FootyFan',
      timeLeft: '9d 2h',
    },
  ];

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Implement join by code
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Joined room successfully!');
      onClose();
    } catch (error) {
      toast.error('Room not found or full');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement join room
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Joined room successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Join a Room</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/20">
            <TabsTrigger value="browse">Browse Public</TabsTrigger>
            <TabsTrigger value="code">Join by Code</TabsTrigger>
            <TabsTrigger value="qr">Scan QR</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search room names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input/50 border-border/50 focus:border-luxury-gold"
              />
            </div>

            <div className="space-y-3">
              {publicRooms.map((room) => (
                <div
                  key={room.id}
                  className="p-4 bg-muted/10 rounded-xl border border-border/30 hover:border-luxury-gold/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <p className="text-sm text-muted-foreground">Hosted by {room.host}</p>
                    </div>
                    <Badge className="bg-luxury-emerald text-black font-semibold">
                      GW {room.startGameweek}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry Fee</span>
                      <div className="font-semibold text-luxury-gold">
                        {formatCurrency(room.buyIn)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Players</span>
                      <div className="font-semibold">
                        {room.playersJoined}/{room.maxPlayers}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Max Pot</span>
                      <div className="font-semibold text-luxury-gold">
                        {formatCurrency(room.buyIn * room.maxPlayers)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Starts In</span>
                      <div className="font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {room.timeLeft}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="w-full bg-muted/20 rounded-full h-2 mr-4">
                      <div 
                        className="bg-luxury-emerald h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(room.playersJoined / room.maxPlayers) * 100}%` }}
                      />
                    </div>
                    <Button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={isLoading}
                      className="bg-emerald-gradient hover:opacity-90 text-black font-semibold whitespace-nowrap"
                    >
                      Join Room
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <form onSubmit={handleJoinByCode} className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto">
                  <QrCode className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enter Room Code</h3>
                  <p className="text-muted-foreground">Get the code from your room host</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinCode">Room Code</Label>
                <Input
                  id="joinCode"
                  placeholder="ABC12345"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="text-center text-lg font-mono bg-input/50 border-border/50 focus:border-luxury-gold"
                  maxLength={8}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !joinCode.trim()}
                className="w-full bg-gold-gradient hover:opacity-90 text-black font-semibold"
              >
                {isLoading ? 'Joining...' : 'Join Room'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <div className="text-center space-y-6">
              <div className="w-32 h-32 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto">
                <QrCode className="w-16 h-16 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">QR Code Scanner</h3>
                <p className="text-muted-foreground mb-4">
                  Point your camera at a room's QR code to join instantly
                </p>
                <Button 
                  className="bg-gold-gradient hover:opacity-90 text-black font-semibold"
                  onClick={() => toast.info('QR scanner coming soon!')}
                >
                  Open Camera
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}