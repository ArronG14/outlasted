'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Mail, Apple, Eye, EyeOff } from 'lucide-react';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const validateUsername = (username: string): string | null => {
    if (!username) return 'Username is required';
    if (username.length < 5) return 'Username must be at least 5 characters';
    if (username.length > 20) return 'Username must be 20 characters or less';
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, hyphens, and underscores';
    }
    if (username.startsWith('-') || username.startsWith('_') || 
        username.endsWith('-') || username.endsWith('_')) {
      return 'Username cannot start or end with hyphens or underscores';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      
      const usernameError = validateUsername(formData.username);
      if (usernameError) newErrors.username = usernameError;
      
      if (!agreedToTerms) newErrors.terms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured() || !supabase) {
      toast.error('Database not configured. Please set up Supabase first.');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              username: formData.username,
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Try signing in instead.');
            setMode('signin');
          } else {
            throw error;
          }
          return;
        }

        if (data.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              username: formData.username,
              name: `${formData.firstName} ${formData.lastName}`,
            });

          if (profileError) {
            if (profileError.message.includes('users_username_unique') || 
                profileError.message.includes('users_username_lower_unique')) {
              toast.error('This username is already taken. Please choose another.');
              return;
            }
            throw profileError;
          }

          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      } else {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please try again.');
          } else {
            throw error;
          }
          return;
        }

        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'apple') => {
    if (!isSupabaseConfigured() || !supabase) {
      toast.error('Database not configured. Please set up Supabase first.');
      return;
    }
    
    if (mode === 'signup' && !agreedToTerms) {
      toast.error('Please agree to the terms first');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="landing-card-frosted rounded-2xl p-6 shadow-luxury-landing animate-slide-up relative overflow-hidden">
      <div className="space-y-4 text-center mb-6">
        <h2 className="text-2xl font-display landing-text-primary">
          {mode === 'signin' ? 'Welcome Back' : 'Join OUTLASTED'}
        </h2>
        <p className="landing-text-body">
          {mode === 'signin' 
            ? 'Sign in to your survival account' 
            : 'Start your survival journey today'
          }
        </p>
      </div>
      
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="landing-text-primary">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    disabled={isLoading}
                    className="bg-landing-input-bg border-landing-accent-gold/30 focus:border-landing-brand-jade focus:ring-2 focus:ring-landing-brand-jade/20 transition-all duration-300 landing-text-primary placeholder:landing-text-muted"
                    required
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-400">{errors.firstName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="landing-text-primary">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    disabled={isLoading}
                    className="bg-landing-input-bg border-landing-accent-gold/30 focus:border-landing-brand-jade focus:ring-2 focus:ring-landing-brand-jade/20 transition-all duration-300 landing-text-primary placeholder:landing-text-muted"
                    required
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-400">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="landing-text-primary">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="gamemaster"
                  value={formData.username}
                  onChange={(e) => updateFormData('username', e.target.value)}
                  disabled={isLoading}
                  className="bg-landing-input-bg border-landing-accent-gold/30 focus:border-landing-brand-jade focus:ring-2 focus:ring-landing-brand-jade/20 transition-all duration-300 landing-text-primary placeholder:landing-text-muted"
                  maxLength={20}
                  required
                />
                <p className="text-xs landing-text-muted">
                  5-20 characters, letters/numbers/hyphens/underscores only (case-insensitive)
                </p>
                {errors.username && (
                  <p className="text-xs text-red-400">{errors.username}</p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="landing-text-primary">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              disabled={isLoading}
              className="bg-landing-input-bg border-landing-accent-gold/30 focus:border-landing-brand-jade focus:ring-2 focus:ring-landing-brand-jade/20 transition-all duration-300 landing-text-primary placeholder:landing-text-muted"
              required
            />
            {errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="landing-text-primary">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                disabled={isLoading}
                className="bg-landing-input-bg border-landing-accent-gold/30 focus:border-landing-brand-jade focus:ring-2 focus:ring-landing-brand-jade/20 transition-all duration-300 landing-text-primary placeholder:landing-text-muted pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 landing-text-muted" />
                ) : (
                  <Eye className="w-4 h-4 landing-text-muted" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="data-[state=checked]:bg-landing-brand-jade data-[state=checked]:border-landing-brand-jade border-landing-accent-gold/30 bg-landing-input-bg"
              />
              <Label htmlFor="terms" className="text-sm landing-text-muted">
                I agree to the Terms of Service and confirm I'm 18+
              </Label>
            </div>
          )}
          {errors.terms && (
            <p className="text-xs text-red-400">{errors.terms}</p>
          )}

          <Button 
            type="submit" 
            className="w-full landing-bg-jade hover:shadow-aqua text-white font-semibold transition-all duration-300 shadow-lg relative overflow-hidden group hover:animate-aqua-hover"
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            <span className="relative z-10">
              {isLoading ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </span>
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/80 px-3 py-1 rounded-full landing-text-muted backdrop-blur-sm">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleSocialAuth('google')}
            disabled={isLoading || (mode === 'signup' && !agreedToTerms)}
            className="bg-landing-input-bg border-landing-accent-gold/30 hover:border-landing-brand-jade hover:shadow-aqua transition-all duration-300 landing-text-body"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocialAuth('apple')}
            disabled={isLoading || (mode === 'signup' && !agreedToTerms)}
            className="bg-landing-input-bg border-landing-accent-gold/30 hover:border-landing-brand-jade hover:shadow-aqua transition-all duration-300 landing-text-body"
          >
            <Apple className="w-4 h-4 mr-2" />
            Apple
          </Button>
        </div>

        <Separator className="bg-slate-200/30" />

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrors({});
              setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                username: '',
              });
            }}
            className="text-sm landing-text-muted hover:text-brand-jade transition-colors"
            disabled={isLoading}
          >
            {mode === 'signin' 
              ? "New to OUTLASTED? Create account" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </div>
    </div>
  );
}