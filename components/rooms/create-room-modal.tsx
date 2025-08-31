'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, DollarSign, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    buyIn: '',
    maxPlayers: '50',
    isPrivate: false,
    startGameweek: '16',
    dgwRule: 'first_fixture',
    noPickPolicy: 'disqualify',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement room creation with Supabase
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      toast.success('Room created successfully!');
      onClose();
      setFormData({
        name: '',
        buyIn: '',
        maxPlayers: '50',
        isPrivate: false,
        startGameweek: '16',
        dgwRule: 'first_fixture',
        noPickPolicy: 'disqualify',
      });
    } catch (error) {
      toast.error('Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-display">
            <Crown className="w-6 h-6 text-luxury-gold" />
            Create Survival Room
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                placeholder="Elite Survivors Championship"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input/50 border-border/50 focus:border-luxury-gold"
                required
              />
              <p className="text-xs text-muted-foreground">Must be unique. Players will join using this name.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyIn">Buy-in ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="buyIn"
                    type="number"
                    placeholder="50"
                    value={formData.buyIn}
                    onChange={(e) => setFormData({ ...formData, buyIn: e.target.value })}
                    className="pl-10 bg-input/50 border-border/50 focus:border-luxury-gold"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Max Players</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="maxPlayers"
                    type="number"
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData({ ...formData, maxPlayers: e.target.value })}
                    className="pl-10 bg-input/50 border-border/50 focus:border-luxury-gold"
                    min="2"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-border/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {formData.isPrivate ? (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Label htmlFor="privacy">
                    {formData.isPrivate ? 'Private Room' : 'Public Room'}
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formData.isPrivate 
                    ? 'Only accessible via invite code or QR scan'
                    : 'Visible in public room listings'
                  }
                </p>
              </div>
              <Switch
                id="privacy"
                checked={formData.isPrivate}
                onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
              />
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Game Rules</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Gameweek</Label>
                <Select value={formData.startGameweek} onValueChange={(value) => setFormData({ ...formData, startGameweek: value })}>
                  <SelectTrigger className="bg-input/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="16">GW 16 (Next Available)</SelectItem>
                    <SelectItem value="17">GW 17</SelectItem>
                    <SelectItem value="18">GW 18</SelectItem>
                    <SelectItem value="19">GW 19</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Double Gameweek Rule</Label>
                <Select value={formData.dgwRule} onValueChange={(value) => setFormData({ ...formData, dgwRule: value })}>
                  <SelectTrigger className="bg-input/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="first_fixture">First Fixture Counts</SelectItem>
                    <SelectItem value="both_fixtures">Both Fixtures Count</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>No-Pick Policy</Label>
              <Select value={formData.noPickPolicy} onValueChange={(value) => setFormData({ ...formData, noPickPolicy: value })}>
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
          </div>

          {/* Summary */}
          <div className="p-4 bg-luxury-gradient rounded-xl border border-border/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-4 h-4 text-luxury-gold" />
              Room Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Entry Fee:</span>
                <div className="font-semibold text-luxury-gold">
                  {formData.buyIn ? `$${formData.buyIn}` : 'Free'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Max Pot:</span>
                <div className="font-semibold text-luxury-gold">
                  {formData.buyIn ? `$${(parseFloat(formData.buyIn) * parseInt(formData.maxPlayers)).toFixed(2)}` : '$0'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Visibility:</span>
                <div className="font-semibold">
                  {formData.isPrivate ? 'Private' : 'Public'}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Starts:</span>
                <div className="font-semibold">GW {formData.startGameweek}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-border/50 hover:border-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.name}
              className="flex-1 bg-gold-gradient hover:opacity-90 text-black font-semibold"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}