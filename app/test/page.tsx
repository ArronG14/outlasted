'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { supabase, isSupabaseConfigured } from '@/lib/supabase';
// import { AuthForm } from '@/components/auth/auth-form';
import { Crown, Trophy, Target } from 'lucide-react';

export default function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a simple test page</p>
    </div>
  );
}
