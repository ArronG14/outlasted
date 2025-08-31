'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase, isSupabaseConfigured } from '@/lib/supabase';
// import { AuthForm } from '@/components/auth/auth-form';
import { Crown, Trophy, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>OUTLASTED</h1>
      <p>Simple test page</p>
      <a href="/simple">Go to simple test</a>
    </div>
  );
}