'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Crown, Trophy, Skull, Clock, CheckCircle } from 'lucide-react';

interface RoomPlayersTabProps {
  room: any;
}

export function RoomPlayersTab({ room }: RoomPlayersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock player data
  const players = [
    {
      id: '1',
      name: 'FootballKing',
      avatar: null,
      status: 'through',
      isHost: true,
      joinedAt: '2024-12-01',
      gamesWon: 3,
      currentStreak: 8,
      picks: [
        { gw: 13, team: 'Liverpool', result: 'win' },
        { gw: 14, team: 'Arsenal', result: 'win' },
        { gw: 15, team: 'Manchester City', result: 'pending' },
      ],
    },
    {
      id: '2',
      name: 'PremierPro',
      avatar: null,
      status: 'through',
      isHost: false,
      joinedAt: '2024-12-01',
      gamesWon: 1,
      currentStreak: 8,
      picks: [
        { gw: 13, team: 'Chelsea', result: 'win' },
        { gw: 14, team: 'Newcastle', result: 'win' },
        { gw: 15, team: 'Brighton', result: 'pending' },
      ],
    },
    {
      id: '3',
      name: 'StrategyMaster',
      avatar: null,
      status: 'out',
      isHost: false,
      joinedAt: '2024-12-01',
      gamesWon: 0,
      currentStreak: 0,
      eliminatedGW: 14,
      picks: [
        { gw: 13, team: 'Tottenham', result: 'win' },
        { gw: 14, team: 'West Ham', result: 'lose' },
      ],
    },
    {
      id: '4',
      name: 'LuckyPunter',
      avatar: null,
      status: 'pending',
      isHost: false,
      joinedAt: '2024-12-01',
      gamesWon: 2,
      currentStreak: 8,
      picks: [
        { gw: 13, team: 'Aston Villa', result: 'win' },
        { gw: 14, team: 'Fulham', result: 'win' },
        { gw: 15, team: null, result: 'pending' },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'through':
        return <CheckCircle className="w-4 h-4 text-luxury-emerald" />;
      case 'out':
        return <Skull className="w-4 h-4 text-destructive" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'through':
        return 'bg-luxury-emerald text-black';
      case 'out':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input/50 border-border/50 focus:border-luxury-gold"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-input/50 border-border/50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border/50">
            <SelectItem value="all">All Players</SelectItem>
            <SelectItem value="through">Still In</SelectItem>
            <SelectItem value="out">Eliminated</SelectItem>
            <SelectItem value="pending">Pending Pick</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Players Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredPlayers.map((player) => (
          <Card key={player.id} className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-luxury-gold text-black font-semibold">
                      {player.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{player.name}</h3>
                      {player.isHost && (
                        <Crown className="w-4 h-4 text-luxury-gold" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Joined {new Date(player.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <Badge className={getStatusColor(player.status)}>
                  {getStatusIcon(player.status)}
                  <span className="ml-1 capitalize">{player.status}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-luxury-gold">{player.gamesWon}</div>
                  <div className="text-xs text-muted-foreground">Games Won</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{player.currentStreak}</div>
                  <div className="text-xs text-muted-foreground">Current Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-luxury-emerald">
                    {player.status === 'out' ? player.eliminatedGW : 'Active'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {player.status === 'out' ? 'Eliminated GW' : 'Status'}
                  </div>
                </div>
              </div>

              {/* Pick History */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Pick History</h4>
                <div className="space-y-1">
                  {player.picks.map((pick, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted/10 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">GW {pick.gw}</span>
                        {pick.team ? (
                          <>
                            <span className="text-xs text-muted-foreground">→</span>
                            <span className="text-sm">{pick.team}</span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">No pick</span>
                        )}
                      </div>
                      
                      {pick.result === 'win' && (
                        <Badge className="bg-luxury-emerald text-black text-xs">
                          Win
                        </Badge>
                      )}
                      {pick.result === 'lose' && (
                        <Badge className="bg-destructive text-destructive-foreground text-xs">
                          Out
                        </Badge>
                      )}
                      {pick.result === 'pending' && (
                        <Badge variant="outline" className="border-border/50 text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No players found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}