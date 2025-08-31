'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Clock, CheckCircle, X, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface DealBannerProps {
  roomId: string;
  dealType: 'split' | 'continue';
  requiredPlayers: number;
  acceptedCount: number;
}

export function DealBanner({ roomId, dealType, requiredPlayers, acceptedCount }: DealBannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userVote, setUserVote] = useState<'accept' | 'reject' | null>(null);

  const handleVote = async (vote: 'accept' | 'reject') => {
    setIsLoading(true);
    try {
      // TODO: Submit vote to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserVote(vote);
      toast.success(`Vote ${vote}ed successfully`);
    } catch (error) {
      toast.error('Failed to submit vote');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b border-border/50 bg-luxury-emerald/5">
      <div className="container mx-auto px-4 py-4">
        <Card className="bg-luxury-gradient border-luxury-emerald/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-luxury-emerald rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-black" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Pot Split Available
                    <Badge className="bg-luxury-emerald text-black">
                      {acceptedCount}/{requiredPlayers} voted
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    All {requiredPlayers} remaining players must agree to split the pot equally
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {userVote ? (
                  <div className="flex items-center gap-2">
                    {userVote === 'accept' ? (
                      <CheckCircle className="w-5 h-5 text-luxury-emerald" />
                    ) : (
                      <X className="w-5 h-5 text-destructive" />
                    )}
                    <span className="text-sm font-medium">
                      You voted to {userVote}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote('reject')}
                      disabled={isLoading}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVote('accept')}
                      disabled={isLoading}
                      className="bg-emerald-gradient hover:opacity-90 text-black font-semibold"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept Split
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Consensus Progress</span>
                <span className="font-semibold">{acceptedCount}/{requiredPlayers} accepted</span>
              </div>
              <div className="w-full bg-muted/20 rounded-full h-2">
                <div 
                  className="bg-luxury-emerald h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(acceptedCount / requiredPlayers) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}