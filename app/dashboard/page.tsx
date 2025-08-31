'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs';
import { OnboardingModal } from '@/components/onboarding/onboarding-modal';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        router.push('/');
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/');
        return;
      }

      setUser(session.user);
      
      // Get or create user profile
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error('Failed to load profile');
        return;
      }

      if (!profile) {
        // Create profile for new user
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || session.user.user_metadata?.given_name || 'User',
            last_name: session.user.user_metadata?.last_name || session.user.user_metadata?.family_name || '',
            username: session.user.user_metadata?.username || `user${session.user.id.substring(0, 8)}`,
            name: session.user.user_metadata?.full_name || `${session.user.user_metadata?.first_name || 'User'} ${session.user.user_metadata?.last_name || ''}`,
            avatar_url: session.user.user_metadata?.avatar_url,
          })
          .select()
          .single();

        if (createError) {
          toast.error('Failed to create profile');
          return;
        }

        setUserProfile(newProfile);
        setShowOnboarding(true);
      } else {
        setUserProfile(profile);
        // Show onboarding if user has no rooms
        if (profile.total_rooms === 0) {
          setShowOnboarding(true);
        }
      }

      setIsLoading(false);
    };

    getSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-gradient">
        <div className="animate-spin h-8 w-8 border-2 border-luxury-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <DashboardHeader user={user} userProfile={userProfile} />
      <main className="container mx-auto px-4 py-8">
        <DashboardTabs userProfile={userProfile} />
      </main>
      
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}