import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    
    // Create Supabase client with cookies
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    );
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (data.user && !error) {
      // Check if user profile exists, create if not (for social auth)
      const { data: profile } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single();
      
      if (!profile) {
        // Create profile for social auth user
        const userData = data.user.user_metadata;
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            first_name: userData?.first_name || userData?.given_name || 'User',
            last_name: userData?.last_name || userData?.family_name || '',
            username: `user${data.user.id.substring(0, 8)}`, // Temporary username
            name: userData?.full_name || `${userData?.first_name || 'User'} ${userData?.last_name || ''}`,
          });
      }
    }
  }

  // Redirect to dashboard after successful authentication
  return NextResponse.redirect(new URL('/dashboard', request.url));
}