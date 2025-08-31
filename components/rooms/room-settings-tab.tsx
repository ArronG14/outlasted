'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { QrCode, Copy, RefreshCw, Settings, Share } from 'lucide-react';
import { toast } from 'sonner';

interface RoomSettingsTabProps {
  room: any;
}

export function RoomSettingsTab({ room }: RoomSettingsTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    dgwRule: 'first_fixture',
    noPickPolicy: 'disqualify',
    dealThreshold: 'auto',
  });

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(room.inviteCode);
      toast.success('Invite code copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy invite code');
    }
  };

  const handleCopyInviteLink = async () => {
    const link = `${window.location.origin}/join/${room.inviteCode}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Invite link copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy invite link');
    }
  };

  const handleRegenerateCode = async () => {
    setIsLoading(true);
    try {
      // TODO: Regenerate invite code
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('New invite code generated');
    } catch (error) {
      toast.error('Failed to regenerate code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Save settings to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Management */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="w-5 h-5 text-luxury-gold" />
            Invite Players
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Room Code</Label>
            <div className="flex gap-2">
              <Input
                value={room.inviteCode}
                readOnly
                className="font-mono text-lg bg-input/50 border-border/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyInviteCode}
                className="border-border/50 hover:border-luxury-gold"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRegenerateCode}
                disabled={isLoading}
                className="border-border/50 hover:border-luxury-gold"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleCopyInviteLink}
              className="border-border/50 hover:border-luxury-emerald"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Invite Link
            </Button>
            <Button
              variant="outline"
              className="border-border/50 hover:border-luxury-gold"
              onClick={() => toast.info('QR code coming soon!')}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Show QR Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Game Rules */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-luxury-gold" />
            Game Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Double Gameweek Rule</Label>
            <Select value={settings.dgwRule} onValueChange={(value) => setSettings({ ...settings, dgwRule: value })}>
              <SelectTrigger className="bg-input/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="first_fixture">First Fixture Counts</SelectItem>
                <SelectItem value="both_fixtures">Both Fixtures Count</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How to handle teams playing twice in a gameweek
            </p>
          </div>

          <div className="space-y-2">
            <Label>No-Pick Policy</Label>
            <Select value={settings.noPickPolicy} onValueChange={(value) => setSettings({ ...settings, noPickPolicy: value })}>
              <SelectTrigger className="bg-input/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="disqualify">Disqualify Player</SelectItem>
                <SelectItem value="random">Random Eligible Team</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              What happens when a player doesn't pick before the lock
            </p>
          </div>

          <div className="space-y-2">
            <Label>Deal Thresholds</Label>
            <Select value={settings.dealThreshold} onValueChange={(value) => setSettings({ ...settings, dealThreshold: value })}>
              <SelectTrigger className="bg-input/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="auto">Auto (Based on starters)</SelectItem>
                <SelectItem value="2">Always at 2 players</SelectItem>
                <SelectItem value="3">Always at 3 players</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              When pot split deals become available
            </p>
          </div>

          <Button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="w-full bg-gold-gradient hover:opacity-90 text-black font-semibold"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>

      {/* Room Stats */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Room Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-luxury-gold">45</div>
              <div className="text-sm text-muted-foreground">Total Starters</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-luxury-emerald">12</div>
              <div className="text-sm text-muted-foreground">Current Survivors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">33</div>
              <div className="text-sm text-muted-foreground">Eliminated</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Gameweeks Played</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}