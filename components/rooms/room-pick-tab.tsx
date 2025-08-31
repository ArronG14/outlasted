'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Calendar, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RoomPickTabProps {
  room: any;
}

export function RoomPickTab({ room }: RoomPickTabProps) {
  const [selectedGameweek, setSelectedGameweek] = useState('15');
  const [selectedTeam, setSelectedTeam] = useState('');

  // Mock data
  const gameweeks = [
    { value: '15', label: 'GW 15 (Current)', lockTime: '2d 14h 23m', status: 'current' },
    { value: '16', label: 'GW 16', lockTime: '9d 14h 23m', status: 'upcoming' },
    { value: '17', label: 'GW 17', lockTime: '16d 14h 23m', status: 'upcoming' },
  ];

  const usedTeams = ['Liverpool', 'Arsenal', 'Chelsea', 'Manchester City'];

  const fixtures = [
    {
      id: '1',
      homeTeam: 'Arsenal',
      awayTeam: 'Liverpool',
      kickoff: '2024-12-21T15:00:00Z',
      isDgw: false,
    },
    {
      id: '2',
      homeTeam: 'Chelsea',
      awayTeam: 'Manchester City',
      kickoff: '2024-12-21T17:30:00Z',
      isDgw: true,
    },
    {
      id: '3',
      homeTeam: 'Tottenham',
      awayTeam: 'Newcastle United',
      kickoff: '2024-12-22T14:00:00Z',
      isDgw: false,
    },
  ];

  const teams = [
    'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United',
    'Tottenham', 'Newcastle United', 'Brighton', 'West Ham', 'Aston Villa',
    'Crystal Palace', 'Fulham', 'Brentford', 'Nottingham Forest', 'Everton',
    'Leicester City', 'Bournemouth', 'Wolverhampton', 'Sheffield United', 'Burnley'
  ];

  const availableTeams = teams.filter(team => !usedTeams.includes(team));
  const selectedGW = gameweeks.find(gw => gw.value === selectedGameweek);

  const handleSavePick = async () => {
    if (!selectedTeam) return;

    try {
      // TODO: Save pick to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Pick saved: ${selectedTeam} for GW ${selectedGameweek}`);
    } catch (error) {
      toast.error('Failed to save pick');
    }
  };

  const formatKickoffTime = (kickoff: string) => {
    return new Date(kickoff).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Gameweek Selector */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-luxury-gold" />
            Select Gameweek
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedGameweek} onValueChange={setSelectedGameweek}>
            <SelectTrigger className="bg-input/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/50">
              {gameweeks.map((gw) => (
                <SelectItem key={gw.value} value={gw.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{gw.label}</span>
                    {gw.status === 'current' && (
                      <Badge className="ml-2 bg-luxury-emerald text-black text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedGW && (
            <div className="p-3 bg-muted/10 rounded-lg border border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Picks lock in:</span>
                <div className="flex items-center gap-1 text-destructive">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono font-semibold animate-countdown-pulse">
                    {selectedGW.lockTime}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Used Teams */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Used Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {usedTeams.map((team) => (
              <Badge
                key={team}
                variant="outline"
                className="border-destructive text-destructive bg-destructive/10"
              >
                <X className="w-3 h-3 mr-1" />
                {team}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            You cannot select these teams again in this room
          </p>
        </CardContent>
      </Card>

      {/* Fixtures & Pick */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fixtures */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>GW {selectedGameweek} Fixtures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fixtures.map((fixture) => (
              <div
                key={fixture.id}
                className="p-3 bg-muted/10 rounded-lg border border-border/30 hover:border-luxury-gold/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted text-xs">
                        {fixture.homeTeam.substring(0, 3).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{fixture.homeTeam}</span>
                    <span className="text-muted-foreground">vs</span>
                    <span className="font-medium">{fixture.awayTeam}</span>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted text-xs">
                        {fixture.awayTeam.substring(0, 3).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  {fixture.isDgw && (
                    <Badge className="bg-luxury-emerald text-black text-xs">
                      DGW
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatKickoffTime(fixture.kickoff)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Team Selection */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Make Your Pick</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="bg-input/50 border-border/50">
                <SelectValue placeholder="Select your team..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50 max-h-48">
                {availableTeams.map((team) => (
                  <SelectItem key={team} value={team}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-muted">
                          {team.substring(0, 3).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {team}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTeam && (
              <div className="p-4 bg-luxury-gradient rounded-xl border border-border/30">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-luxury-gold text-black font-semibold">
                      {selectedTeam.substring(0, 3).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{selectedTeam}</div>
                    <div className="text-sm text-muted-foreground">GW {selectedGameweek} Pick</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge className="bg-luxury-emerald text-black">
                    Safe Pick
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={handleSavePick}
                disabled={!selectedTeam}
                className="w-full bg-gold-gradient hover:opacity-90 text-black font-semibold"
              >
                {selectedTeam ? `Save Pick: ${selectedTeam}` : 'Select a team first'}
              </Button>

              {selectedTeam && (
                <div className="flex items-center gap-2 text-sm text-luxury-emerald justify-center">
                  <CheckCircle className="w-4 h-4" />
                  <span>You can change this pick until the lock</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-muted/10 rounded-lg border border-border/30">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <strong>Reminder:</strong> Picks lock 90 minutes before the first kickoff of GW {selectedGameweek}. 
                  All picks are revealed at lock time.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}