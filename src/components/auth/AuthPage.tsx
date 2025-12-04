import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Check, Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type AuthTab = 'signin' | 'signup';

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/invalid-credential' 
        ? 'Invalid email or password' 
        : error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'Email is already registered'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-5xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border bg-card">
        
        {/* Marketing Panel */}
        <div className="md:w-1/2 bg-foreground text-primary-foreground p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/10"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Manage Your Money
            </h1>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Track expenses, visualize spending patterns, and take control of your finances with our intuitive personal finance tracker.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-muted-foreground">
                <Check className="w-5 h-5 text-primary mr-3" />
                Real-time expense tracking
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check className="w-5 h-5 text-primary mr-3" />
                Smart analytics & insights
              </li>
              <li className="flex items-center text-muted-foreground">
                <Check className="w-5 h-5 text-primary mr-3" />
                Secure cloud storage
              </li>
            </ul>
          </div>
        </div>

        {/* Auth Panel */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card relative">
          <div className="md:hidden mb-6 flex items-center gap-2 text-primary font-bold text-xl">
            <TrendingUp className="w-6 h-6" />
            Finance
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-muted rounded-xl mb-8 w-fit mx-auto md:mx-0">
            <button
              onClick={() => setActiveTab('signin')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'signin'
                  ? 'bg-card shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-card shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-3 rounded-xl font-bold transition-colors shadow-primary-glow mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-1">Must be at least 6 characters</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-3 rounded-xl font-bold transition-colors shadow-primary-glow mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
              <p className="text-xs text-center text-muted-foreground mt-4">
                By signing up, you agree to our Terms and Privacy Policy.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
