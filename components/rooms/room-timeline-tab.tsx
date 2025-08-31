'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Crown, Skull, CheckCircle, Users, RotateCcw, AlertTriangle } from 'lucide-react';

interface RoomTimelineTabProps {
  room: any;
}

export function RoomTimelineTab({ room }: RoomTimelineTabProps) {
  // Mock timeline events
  const events = [
    {
      id: '1',
      type: 'deal_proposed',
      timestamp: '2024-12-19T10:30:00Z',
      user: 'FootballKing',
      description: 'proposed a pot split',
      details: 'Split remaining pot between 12 survivors',
      status: 'pending',
    },
    {
      id: '2',
      type: 'pick_locked',
      timestamp: '2024-12-18T19:30:00Z',
      description: 'GW 14 picks locked and revealed',
      details: '45 picks submitted',
      picks: [
        { user: 'FootballKing', team: 'Arsenal' },
        { user: 'PremierPro', team: 'Newcastle' },
        { user: 'StrategyMaster', team: 'West Ham' },
      ],
    },
    {
      id: '3',
      type: 'elimination',
      timestamp: '2024-12-18T22:00:00Z',
      user: 'StrategyMaster',
      description: 'was eliminated',
      details: 'West Ham lost 1-2 to Brighton',
      team: 'West Ham',
    },
    {
      id: '4',
      type: 'results_final',
      timestamp: '2024-12-18T22:30:00Z',
      description: 'GW 14 results finalized',
      details: '33 players eliminated, 12 survivors remain',
      survivors: 12,
      eliminated: 33,
    },
    {
      id: '5',
      type: 'game_started',
      timestamp: '2024-12-01T12:00:00Z',
      description: 'Survival game started',
      details: '45 players joined for GW 13',
      starters: 45,
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'deal_proposed':
        return <Users className="w-4 h-4 text-luxury-emerald" />;
      case 'pick_locked':
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'elimination':
        return <Skull className="w-4 h-4 text-destructive" />;
      case 'results_final':
        return <CheckCircle className="w-4 h-4 text-luxury-emerald" />;
      case 'game_started':
        return <Crown className="w-4 h-4 text-luxury-gold" />;
      case 'restart':
        return <RotateCcw className="w-4 h-4 text-luxury-gold" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Live Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < events.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-16 bg-border/50" />
                )}
                
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center border border-border/30">
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {event.user && (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-muted text-xs">
                              {event.user.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="font-medium">
                          {event.user && <span className="text-luxury-gold">{event.user} </span>}
                          {event.description}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{event.details}</p>
                    
                    {/* Special content based on event type */}
                    {event.type === 'pick_locked' && event.picks && (
                      <div className="p-3 bg-muted/10 rounded-lg border border-border/30 space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">Sample Picks Revealed:</div>
                        <div className="space-y-1">
                          {event.picks.map((pick, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span>{pick.user}</span>
                              <Badge variant="outline" className="border-border/50 text-xs">
                                {pick.team}
                              </Badge>
                            </div>
                          ))}
                          <div className="text-xs text-muted-foreground text-center pt-1">
                            + 42 more picks
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {event.type === 'deal_proposed' && event.status && (
                      <Badge 
                        className={
                          event.status === 'pending' 
                            ? 'bg-muted text-muted-foreground' 
                            : 'bg-luxury-emerald text-black'
                        }
                      >
                        {event.status === 'pending' ? 'Voting Open' : 'Deal Accepted'}
                      </Badge>
                    )}
                    
                    {event.type === 'elimination' && event.team && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-destructive text-destructive-foreground text-xs">
                          {event.team}
                        </Badge>
                        <span className="text-xs text-muted-foreground">lost</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}