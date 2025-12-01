import { LoginForm } from '@/components/auth/LoginForm';
import { Link } from 'react-router-dom';

const JudgeLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-warm p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <LoginForm role="judge" redirectPath="/judge/dashboard" />
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <span>Other portals: </span>
          <Link to="/user" className="text-primary hover:underline">User</Link>
          <span> • </span>
          <Link to="/admin" className="text-primary hover:underline">Admin</Link>
        </div>
      </div>
    </div>
  );
};

export default JudgeLogin;
