'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase, isSupabaseConfigured } from '@/lib/supabase';
// import { AuthForm } from '@/components/auth/auth-form';
import { Crown, Trophy, Target } from 'lucide-react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     if (!isSupabaseConfigured() || !supabase) {
  //       setIsLoading(false);
  //       return;
  //     }
      
  //     try {
  //       const { data: { session } } = await supabase.auth.getSession();
  //       if (session) {
  //         router.push('/dashboard');
  //       }
  //     } catch (error) {
  //       console.error('Auth check failed:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1>OUTLASTED</h1>
      <p>Simple test page</p>
    </div>
  );
}