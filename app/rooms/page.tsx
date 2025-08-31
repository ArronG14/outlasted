'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Crown, Users, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoomsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [buyInFilter, setBuyInFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const router = useRouter();

  // Mock room data
  const publicRooms = [
    {
      id: '1',
      name: 'Weekend Warriors',
      host: 'MatchMaster',
      hostAvatar: null,
      playersJoined: 23,
      maxPlayers: 40,
      buyIn: 2500,
      startGameweek: 16,
      timeLeft: '2d 14h',
      status: 'filling',
    },
    {
      id: '2',
      name: 'Premier Predictions',
      host: 'FootyFan',
      hostAvatar: null,
      playersJoined: 15,
      maxPlayers: 25,
      buyIn: 5000,
      startGameweek: 17,
      timeLeft: '9d 2h',
      status: 'filling',
    },
    {
      id: '3',
      name: 'High Rollers Only',
      host: 'BigBetBen',
      hostAvatar: null,
      playersJoined: 8,
      maxPlayers: 20,
      buyIn: 10000,
      startGameweek: 16,
      timeLeft: '2d 14h',
      status: 'filling',
    },
    {
      id: '4',
      name: 'Casual Champions',
      host: 'SoccerSue',
      hostAvatar: null,
      playersJoined: 45,
      maxPlayers: 50,
      buyIn: 1000,
      startGameweek: 18,
      timeLeft: '16d 8h',
      status: 'filling',
    },
  ];

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const filteredRooms = publicRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuyIn = buyInFilter === 'all' || 
      (buyInFilter === 'free' && room.buyIn === 0) ||
      (buyInFilter === 'low' && room.buyIn > 0 && room.buyIn <= 2500) ||
      (buyInFilter === 'medium' && room.buyIn > 2500 && room.buyIn <= 7500) ||
      (buyInFilter === 'high' && room.buyIn > 7500);
    
    const matchesSize = sizeFilter === 'all' ||
      (sizeFilter === 'small' && room.maxPlayers <= 20) ||
      (sizeFilter === 'medium' && room.maxPlayers > 20 && room.maxPlayers <= 40) ||
      (sizeFilter === 'large' && room.maxPlayers > 40);

    return matchesSearch && matchesBuyIn && matchesSize;
  });

  return (
    <div className="min-h-screen bg-luxury-gradient">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-muted/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold">Public Rooms</h1>
              <p className="text-muted-foreground">Join survival games from the community</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search room names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input/50 border-border/50 focus:border-luxury-gold"
              />
            </div>

            <Select value={buyInFilter} onValueChange={setBuyInFilter}>
              <SelectTrigger className="w-[150px] bg-input/50 border-border/50">
                <DollarSign className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Buy-in" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="all">All Buy-ins</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="low">$1 - $25</SelectItem>
                <SelectItem value="medium">$25 - $75</SelectItem>
                <SelectItem value="high">$75+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="w-[150px] bg-input/50 border-border/50">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small (≤20)</SelectItem>
                <SelectItem value="medium">Medium (21-40)</SelectItem>
                <SelectItem value="large">Large (40+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <Card
              key={room.id}
              className="group bg-card/80 backdrop-blur-sm border-border/50 hover:border-luxury-gold/50 transition-all duration-300 hover:shadow-luxury cursor-pointer"
              onClick={() => router.push(`/rooms/${room.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display text-xl font-semibold group-hover:text-luxury-gold transition-colors">
                    {room.name}
                  </h3>
                  <Badge className="bg-luxury-emerald text-black font-semibold">
                    GW {room.startGameweek}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-muted text-xs">
                      {room.host.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Hosted by {room.host}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-luxury-gradient rounded-xl border border-border/30">
                  <div className="text-center">
                    <div className="text-lg font-bold text-luxury-gold">
                      {formatCurrency(room.buyIn)}
                    </div>
                    <div className="text-xs text-muted-foreground">Entry Fee</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-luxury-gold">
                      {formatCurrency(room.buyIn * room.maxPlayers)}
                    </div>
                    <div className="text-xs text-muted-foreground">Max Pot</div>
                  </div>
                </div>

                {/* Players Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Players</span>
                    <span className="font-semibold">{room.playersJoined}/{room.maxPlayers}</span>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2">
                    <div 
                      className="bg-luxury-emerald h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(room.playersJoined / room.maxPlayers) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Time Left */}
                <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Starts in</span>
                  </div>
                  <span className="font-mono font-semibold text-destructive">
                    {room.timeLeft}
                  </span>
                </div>

                {/* Join Button */}
                <Button 
                  className="w-full bg-emerald-gradient hover:opacity-90 text-black font-semibold"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement join logic
                  }}
                >
                  Join Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or create a new room
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="bg-gold-gradient hover:opacity-90 text-black font-semibold"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}