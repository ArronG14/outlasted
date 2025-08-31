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
        
        // Extract user data safely
        const firstName = userData?.first_name || userData?.given_name || 'User';
        const lastName = userData?.last_name || userData?.family_name || '';
        const fullName = userData?.full_name || `${firstName} ${lastName}`.trim();
        const username = `user${data.user.id.substring(0, 8)}`;
        
        await supabase
          .from('users')
          .insert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            username: username,
            name: fullName,
          });
      }
    }
  }

  // Redirect to dashboard after successful authentication
  return NextResponse.redirect(new URL('/dashboard', request.url));
}