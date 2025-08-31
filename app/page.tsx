'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AuthForm } from '@/components/auth/auth-form';
import { Crown, Trophy, Target } from 'lucide-react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center landing-bg">
        <div className="animate-spin h-8 w-8 border-2 border-landing-accent-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen landing-bg flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Branding */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 landing-feature-card rounded-full px-4 py-2 animate-float">
                  <Crown className="w-4 h-4 landing-accent-gold" />
                  <span className="text-sm font-medium landing-text-body">Premium Football Survival</span>
                </div>
                
                <h1 className="font-display text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="landing-brand-jade animate-logo-glow relative">
                    OUTLASTED
                  </span>
                </h1>
                
                <p className="text-xl landing-text-body max-w-md mx-auto lg:mx-0">
                  Survive the week. Take the pot. Join the most exclusive football prediction survival game.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-lg mx-auto lg:max-w-none lg:mx-0">
                <div className="text-center lg:text-left group">
                  <div className="w-12 h-12 mx-auto lg:mx-0 mb-3 rounded-xl landing-feature-card flex items-center justify-center group-hover:border-landing-accent-blue transition-all duration-300">
                    <Target className="w-6 h-6 landing-accent-blue" />
                  </div>
                  <h3 className="font-semibold text-sm landing-text-primary mb-2">Strategic Picks</h3>
                  <p className="text-xs landing-text-muted leading-relaxed">One team per gameweek. No reuse. Pure strategy.</p>
                </div>
                
                <div className="text-center lg:text-left group">
                  <div className="w-12 h-12 mx-auto lg:mx-0 mb-3 rounded-xl landing-feature-card flex items-center justify-center group-hover:border-landing-accent-coral transition-all duration-300">
                    <Trophy className="w-6 h-6 landing-accent-coral" />
                  </div>
                  <h3 className="font-semibold text-sm landing-text-primary mb-2">Real Stakes</h3>
                  <p className="text-xs landing-text-muted leading-relaxed">Winner takes all. Split deals when it matters.</p>
                </div>
                
                <div className="text-center lg:text-left group">
                  <div className="w-12 h-12 mx-auto lg:mx-0 mb-3 rounded-xl landing-feature-card flex items-center justify-center group-hover:border-landing-accent-teal transition-all duration-300">
                    <Crown className="w-6 h-6 landing-accent-teal" />
                  </div>
                  <h3 className="font-semibold text-sm landing-text-primary mb-2">Elite Community</h3>
                  <p className="text-xs landing-text-muted leading-relaxed">Private rooms. Invite-only leagues.</p>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="max-w-md mx-auto w-full">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 py-6 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-sm landing-text-muted border-t border-landing-accent-gold/20 bg-landing-bg-card/30 backdrop-blur-sm">
          <div>© 2025 OUTLASTED. All rights reserved.</div>
          <div className="flex gap-6">
            <button className="hover:text-landing-brand-jade transition-colors">Terms</button>
            <button className="hover:text-landing-brand-jade transition-colors">Privacy</button>
          </div>
        </div>
      </footer>
    </div>
  );
}