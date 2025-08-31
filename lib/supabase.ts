import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-anon-key');
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          first_name: string;
          last_name: string;
          username: string;
          avatar_url: string | null;
          total_rooms: number;
          total_wins: number;
          total_earnings_cents: number;
          best_streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          first_name: string;
          last_name: string;
          username: string;
          avatar_url?: string | null;
          total_rooms?: number;
          total_wins?: number;
          total_earnings_cents?: number;
          best_streak?: number;
        };
        Update: {
          name?: string;
          first_name?: string;
          last_name?: string;
          username?: string;
          avatar_url?: string | null;
          total_rooms?: number;
          total_wins?: number;
          total_earnings_cents?: number;
          best_streak?: number;
        };
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          visibility: 'public' | 'private';
          host_user_id: string;
          buy_in_cents: number;
          currency: string;
          max_players: number;
          rules: any;
          status: 'open' | 'full' | 'started' | 'completed';
          invite_code: string;
          created_at: string;
          updated_at: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          logo_url: string | null;
          league_id: string;
          created_at: string;
        };
      };
    };
  };
};