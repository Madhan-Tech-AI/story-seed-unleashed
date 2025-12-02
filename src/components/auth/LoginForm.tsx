import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  role: 'user' | 'judge' | 'admin';
  redirectPath: string;
}

export const LoginForm = ({ role, redirectPath }: LoginFormProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const roleLabels = {
    user: 'User',
    judge: 'Judge',
    admin: 'Admin',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'signup') {
      const { success, error } = await signup(email, password, name || 'User', role);

      if (success) {
        toast({
          title: 'Signup Successful! 🎉',
          description: 'Please check your email to verify your account.',
        });
        setMode('login');
      } else {
        toast({
          title: 'Signup Failed',
          description: error || 'Unable to create account. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      const { success, error } = await login(email, password, role);

      if (success) {
        toast({
          title: 'Login Successful',
          description: `Welcome back! You're now logged in as ${roleLabels[role]}.`,
        });
        navigate(redirectPath);
      } else {
        toast({
          title: 'Login Failed',
          description: error || 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-gradient-hero rounded-2xl flex items-center justify-center mb-4">
          {mode === 'login' ? (
            <LogIn className="w-8 h-8 text-primary-foreground" />
          ) : (
            <UserPlus className="w-8 h-8 text-primary-foreground" />
          )}
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          {mode === 'login' ? `${roleLabels[role]} Login` : `${roleLabels[role]} Sign Up`}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'login'
            ? `Sign in to your ${roleLabels[role].toLowerCase()} account`
            : `Create your ${roleLabels[role].toLowerCase()} account`}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mode === 'login' && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <a href="#" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      {/* Toggle between login and signup */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <span className="text-primary font-medium">Sign up</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="text-primary font-medium">Sign in</span>
            </>
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};
