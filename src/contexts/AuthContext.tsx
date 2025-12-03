import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

type UserRole = 'user' | 'judge' | 'admin' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Fetch user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .single();

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, avatar')
        .eq('id', supabaseUser.id)
        .single();

      const role = (roleData?.role as UserRole) || 'user';
      const name = profileData?.name || supabaseUser.user_metadata?.name || 'User';
      const avatar = profileData?.avatar || supabaseUser.user_metadata?.avatar_url || DEFAULT_AVATAR;

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role,
        name,
        avatar,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession?.user) {
          setSession(existingSession);
          const userData = await fetchUserData(existingSession.user);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        
        if (event === 'SIGNED_OUT' || !newSession?.user) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (newSession?.user) {
          // Use setTimeout to avoid deadlock with Supabase client
          setTimeout(async () => {
            const userData = await fetchUserData(newSession.user);
            setUser(userData);
            setIsLoading(false);
          }, 0);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        console.error('Login error:', error);
        return false;
      }

      // Verify user has the correct role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .eq('role', role)
        .single();

      if (!roleData && role !== 'user') {
        // User doesn't have the required role
        await supabase.auth.signOut();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const signup = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Signup failed' };
      }

      // Assign role to user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: role || 'user',
        });

      if (roleError) {
        console.error('Error assigning role:', roleError);
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        signup,
        logout,
        role: user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
