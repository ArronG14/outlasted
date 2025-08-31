'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Crown, Users, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface PickPlannerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PickPlannerDrawer({ isOpen, onClose }: PickPlannerDrawerProps) {
  const [selectedGameweek, setSelectedGameweek] = useState('15');
  const [picks, setPicks] = useState<Record<string, string>>({});

  // Mock data
  const gameweeks = [
    { value: '15', label: 'GW 15 (Current)', lockTime: '2d 14h 23m', status: 'current' },
    { value: '16', label: 'GW 16', lockTime: '9d 14h 23m', status: 'upcoming' },
    { value: '17', label: 'GW 17', lockTime: '16d 14h 23m', status: 'upcoming' },
  ];

  const userRooms = [
    {
      id: '1',
      name: 'Elite Survivors',
      playersLeft: 12,
      usedTeams: ['Liverpool', 'Arsenal', 'Chelsea'],
      currentPick: picks['1'] || null,
    },
    {
      id: '2',
      name: 'High Stakes United',
      playersLeft: 8,
      usedTeams: ['Manchester City', 'Tottenham', 'Newcastle'],
      currentPick: picks['2'] || null,
    },
  ];

  const teams = [
    'Arsenal', 'Chelsea', 'Liverpool', 'Manchester City', 'Manchester United',
    'Tottenham', 'Newcastle United', 'Brighton', 'West Ham', 'Aston Villa',
    'Crystal Palace', 'Fulham', 'Brentford', 'Nottingham Forest', 'Everton',
    'Leicester City', 'Bournemouth', 'Wolverhampton', 'Sheffield United', 'Burnley'
  ];

  const handlePickChange = (roomId: string, teamName: string) => {
    setPicks(prev => ({ ...prev, [roomId]: teamName }));
  };

  const handleSavePicks = async () => {
    try {
      // TODO: Save picks to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Picks saved successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to save picks');
    }
  };

  const getAvailableTeams = (roomId: string) => {
    const room = userRooms.find(r => r.id === roomId);
    if (!room) return teams;
    
    return teams.filter(team => !room.usedTeams.includes(team));
  };

  const selectedGW = gameweeks.find(gw => gw.value === selectedGameweek);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[540px] bg-card border-border/50 overflow-y-auto">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-2xl font-display flex items-center gap-2">
            <Calendar className="w-6 h-6 text-luxury-gold" />
            Pick Planner
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Gameweek Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Select Gameweek</h3>
              {selectedGW && (
                <div className="flex items-center gap-1 text-sm text-destructive">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono font-semibold">
                    {selectedGW.lockTime}
                  </span>
                </div>
              )}
            </div>
            
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
          </div>

          {/* Room Picks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Rooms</h3>
              <Badge variant="outline" className="border-border/50">
                {userRooms.length} rooms
              </Badge>
            </div>

            {userRooms.map((room) => {
              const availableTeams = getAvailableTeams(room.id);
              const hasConflict = Object.values(picks).filter(pick => pick === picks[room.id]).length > 1;

              return (
                <div
                  key={room.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    hasConflict 
                      ? 'bg-destructive/10 border-destructive/50' 
                      : 'bg-muted/10 border-border/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{room.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{room.playersLeft} survivors</span>
                      </div>
                    </div>
                    {hasConflict && (
                      <Badge className="bg-destructive text-destructive-foreground">
                        Conflict
                      </Badge>
                    )}
                  </div>

                  {/* Used Teams */}
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2">Used teams:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.usedTeams.map((team) => (
                        <Badge
                          key={team}
                          variant="outline"
                          className="text-xs border-border/50 bg-muted/20"
                        >
                          <X className="w-2 h-2 mr-1" />
                          {team}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Team Selection */}
                  <div className="space-y-2">
                    <Select 
                      value={picks[room.id] || ''} 
                      onValueChange={(value) => handlePickChange(room.id, value)}
                    >
                      <SelectTrigger className="bg-input/50 border-border/50">
                        <SelectValue placeholder="Select team..." />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50 max-h-48">
                        {availableTeams.map((team) => (
                          <SelectItem key={team} value={team}>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={`/team-logos/${team.toLowerCase().replace(/\s+/g, '-')}.png`} />
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

                    {picks[room.id] && (
                      <div className="flex items-center gap-2 text-sm text-luxury-emerald">
                        <CheckCircle className="w-4 h-4" />
                        <span>Pick saved for {room.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/30">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePicks}
              disabled={Object.keys(picks).length === 0}
              className="flex-1 bg-gold-gradient hover:opacity-90 text-black font-semibold"
            >
              Save All Picks
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}