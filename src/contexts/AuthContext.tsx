import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

type UserRole = 'user' | 'judge' | 'admin' | null;

interface User {
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  role: UserRole;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from database
  const fetchUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error || !data) return null;
      return data.role as UserRole;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name, avatar')
        .eq('id', userId)
        .single();

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          const role = await fetchUserRole(session.user.id);
          
          setUser({
            email: session.user.email || '',
            role,
            name: profile?.name || 'User',
            avatar: profile?.avatar,
          });
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        const role = await fetchUserRole(session.user.id);
        
        setUser({
          email: session.user.email || '',
          role,
          name: profile?.name || 'User',
          avatar: profile?.avatar,
        });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole, fetchUserProfile]);

  const signup = useCallback(async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role, // Store role in metadata as well
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Signup failed - no user created' };
      }

      // Assign role to user - this is critical for role-based access
      if (role) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role });

        if (roleError) {
          console.error('Error assigning role:', roleError);
          return { 
            success: false, 
            error: 'Account created but role assignment failed. Please contact support.' 
          };
        }
      } else {
        return { 
          success: false, 
          error: 'Role is required for signup' 
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, []);

  const login = useCallback(async (
    email: string, 
    password: string, 
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userRole = await fetchUserRole(data.user.id);
        
        // Check if user has the required role
        if (role && userRole !== role) {
          await supabase.auth.signOut();
          return { 
            success: false, 
            error: `You don't have ${role} access. Please use the correct login portal.` 
          };
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [fetchUserRole]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        role: user?.role || null,
        loading,
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
