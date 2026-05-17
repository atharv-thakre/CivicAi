import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, Loader2, HardHat } from 'lucide-react';
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
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('token', data.access_token); // For compatibility with standard officer fetch
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
    <div className="dark min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden text-foreground">
      {/* iOS Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <form onSubmit={handleLogin} className="ios-glass p-8 rounded-[32px] border border-border/50 shadow-2xl space-y-6 bg-card/80">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-[20px] shadow-xl flex items-center justify-center text-white mb-4">
              <HardHat className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight">CIVIC AI</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Worker Portal</p>
            </div>
          </div>
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
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Worker ID / Email</label>
              <Input 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="WRK-4050 or email@civic.ai" 
                className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg focus-visible:ring-blue-600/30 transition-all font-mono"
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
                  className="h-14 rounded-2xl bg-secondary/30 border-none px-6 text-lg focus-visible:ring-blue-600/30 transition-all font-mono"
                  required
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 rounded-xl text-muted-foreground hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-blue-600 hover:bg-blue-600/90 text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
              </div>
            ) : "Sign In"}
          </Button>

          <div className="pt-4 text-center">
            <Button variant="link" type="button" className="text-muted-foreground text-sm gap-2">
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
