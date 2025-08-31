'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/rooms/room-card';
import { CreateRoomModal } from '@/components/rooms/create-room-modal';
import { JoinRoomModal } from '@/components/rooms/join-room-modal';
import { PickPlannerDrawer } from '@/components/picks/pick-planner-drawer';
import { Plus, Search, Calendar, QrCode } from 'lucide-react';

interface DashboardTabsProps {
  userProfile: any;
}

export function DashboardTabs({ userProfile }: DashboardTabsProps) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showPickPlanner, setShowPickPlanner] = useState(false);
  
  // Mock data for demonstration
  const ongoingRooms = [
    {
      id: '1',
      name: 'Elite Survivors',
      pot: 25000,
      playersLeft: 12,
      totalStarters: 45,
      nextGameweek: 15,
      lockCountdown: '2d 14h 23m',
      userPick: null,
      hasDeal: false,
    },
    {
      id: '2',
      name: 'High Stakes United',
      pot: 15000,
      playersLeft: 8,
      totalStarters: 30,
      nextGameweek: 15,
      lockCountdown: '2d 14h 23m',
      userPick: 'Arsenal',
      hasDeal: true,
    },
  ];

  const upcomingRooms = [
    {
      id: '3',
      name: 'January Champions',
      pot: 0,
      playersLeft: 25,
      totalStarters: 25,
      nextGameweek: 16,
      lockCountdown: '9d 2h 15m',
      userPick: null,
      hasDeal: false,
    },
  ];

  const EmptyState = ({ title, description, action }: { title: string; description: string; action: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => setShowCreateRoom(true)}
            className="bg-gold-gradient hover:opacity-90 text-black font-semibold transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Room
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowJoinRoom(true)}
            className="border-border/50 hover:border-luxury-emerald"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Join Room
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowPickPlanner(true)}
            className="border-border/50 hover:border-luxury-gold"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Pick Planner
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ongoing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 border border-border/50">
            <TabsTrigger value="ongoing" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black">
              Ongoing
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="previous" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-black">
              Previous
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing" className="space-y-4">
            {ongoingRooms.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ongoingRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Active Games"
                description="Join your first room to start surviving the Premier League gameweeks."
                action={
                  <Button 
                    onClick={() => setShowJoinRoom(true)}
                    className="bg-gold-gradient hover:opacity-90 text-black font-semibold transition-all duration-300"
                  >
                    Join a Room
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingRooms.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Upcoming Games"
                description="Create or join rooms that start in future gameweeks."
                action={
                  <Button 
                    onClick={() => setShowCreateRoom(true)}
                    className="bg-gold-gradient hover:opacity-90 text-black font-semibold transition-all duration-300"
                  >
                    Create Room
                  </Button>
                }
              />
            )}
          </TabsContent>

          <TabsContent value="previous" className="space-y-4">
            <EmptyState
              title="No Previous Games"
              description="Your completed survival games will appear here with your performance history."
              action={
                <Button 
                  onClick={() => setShowCreateRoom(true)}
                  variant="outline"
                  className="border-border/50 hover:border-gold-luxe"
                >
                  Start Your First Game
                </Button>
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateRoomModal 
        isOpen={showCreateRoom} 
        onClose={() => setShowCreateRoom(false)} 
      />
      <JoinRoomModal 
        isOpen={showJoinRoom} 
        onClose={() => setShowJoinRoom(false)} 
      />
      <PickPlannerDrawer 
        isOpen={showPickPlanner} 
        onClose={() => setShowPickPlanner(false)} 
      />
    </>
  );
}