'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Crown, Target, Clock, RotateCcw, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    icon: Target,
    title: 'Pick to Survive',
    description: 'Each gameweek, pick one Premier League team. If they win, you survive. Draw or lose? You\'re out.',
    visual: (
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-luxury-emerald rounded-xl flex items-center justify-center">
          <span className="text-black font-bold">W</span>
        </div>
        <ArrowRight className="w-6 h-6 text-muted-foreground" />
        <div className="w-16 h-16 bg-gold-gradient rounded-xl flex items-center justify-center">
          <Crown className="w-8 h-8 text-black" />
        </div>
      </div>
    ),
  },
  {
    icon: Crown,
    title: 'Join Multiple Rooms',
    description: 'Play in public rooms or create private ones with friends. Each room is independent with its own pot.',
    visual: (
      <div className="grid grid-cols-3 gap-3">
        {['Public Room', 'Private VIP', 'Friends Only'].map((name, i) => (
          <div key={i} className="p-3 bg-muted/20 rounded-lg border border-border/30 text-center">
            <div className="text-xs font-medium">{name}</div>
            <div className="text-xs text-luxury-gold mt-1">$250</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Clock,
    title: 'Picks & Locks',
    description: 'Set picks for future gameweeks. All picks lock 90 minutes before the first kickoff and are revealed then.',
    visual: (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
          <span className="text-sm">GW 15 Picks</span>
          <Badge className="bg-error text-white animate-countdown-pulse">
            2d 14h 23m
          </Badge>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg opacity-60">
          <span className="text-sm">GW 16 Picks</span>
          <span className="text-xs text-muted-foreground">Open</span>
        </div>
      </div>
    ),
  },
  {
    icon: X,
    title: 'No Team Reuse',
    description: 'Once you pick a team in a room, you can\'t use them again in that same game. Choose wisely.',
    visual: (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {['Arsenal', 'Liverpool', 'Chelsea'].map((team) => (
            <Badge key={team} variant="outline" className="border-error text-error">
              <X className="w-2 h-2 mr-1" />
              {team}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">Used teams in this room</p>
      </div>
    ),
  },
  {
    icon: Trophy,
    title: 'Win & Restart',
    description: 'Last survivor takes the pot! Games automatically restart the next gameweek. Choose to stay or leave.',
    visual: (
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-gold-gradient rounded-full flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-black" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4 text-luxury-emerald" />
          <span className="text-sm text-luxury-emerald">Auto-restart next GW</span>
        </div>
      </div>
    ),
  },
];

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md bg-card border-border/50 p-0 gap-0">
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amethyst-gradient rounded-xl flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-black" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <h2 className="text-2xl font-display font-bold mb-2">{slide.title}</h2>
          <p className="text-muted-foreground">{slide.description}</p>
        </div>

        {/* Visual */}
        <div className="p-6 flex items-center justify-center min-h-[120px]">
          {slide.visual}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentSlide + 1} of {slides.length}</span>
              <span>{Math.round(((currentSlide + 1) / slides.length) * 100)}%</span>
            </div>
            <Progress 
              value={((currentSlide + 1) / slides.length) * 100} 
              className="h-2"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex-1 border-border/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {currentSlide === slides.length - 1 ? (
              <Button
                onClick={handleFinish}
                className="flex-1 bg-gold-gradient hover:opacity-90 text-black font-semibold transition-all duration-300"
              >
                Get Started
                <Crown className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={nextSlide}
               className="flex-1 bg-emerald-gradient hover:opacity-90 text-white font-semibold"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground hover:text-foreground text-sm"
          >
            Skip tutorial
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}