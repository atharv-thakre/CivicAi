import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://app.totalchaos.online/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save auth data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_uid', data.uid);
        
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Access Denied: Invalid credentials');
      }
    } catch (err) {
      setError('System Error: Connection to Civic-Core failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* iOS Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-civic-green/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10 space-y-4">
          <div className="mx-auto w-20 h-20 bg-primary rounded-[22px] shadow-2xl flex items-center justify-center text-white transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
            <Shield className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">CIVIC AI</h1>
            <p className="text-muted-foreground font-medium">Internal Production Portal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="ios-glass p-8 rounded-[32px] border border-border/50 shadow-2xl space-y-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-3 rounded-xl text-center uppercase tracking-wider"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Officer ID / Email</label>
              <Input 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="OFF-1129 or email@civic.ai" 
                className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg focus-visible:ring-primary/30 transition-all font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Access Key</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg focus-visible:ring-primary/30 transition-all font-mono"
                  required
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 rounded-xl text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
              </div>
            ) : "Sign In"}
          </Button>

          <div className="pt-4 text-center">
            <Button variant="link" className="text-muted-foreground text-sm gap-2">
              <Lock className="w-4 h-4" /> Forgot Access Key?
            </Button>
          </div>
        </form>

        <p className="text-center mt-10 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-50">
          SECURED BY CIVIC-CORE BLOCKCHAIN PROTOCOL 4.2
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
