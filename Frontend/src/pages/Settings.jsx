import React from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, Bell, User, Eye, Lock, Database, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/context/ThemeContext';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your portal preferences and security parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-2">
          {[
            { label: 'General', icon: Settings, active: true },
            { label: 'Security', icon: Shield },
            { label: 'Notifications', icon: Bell },
            { label: 'Privacy', icon: Lock },
            { label: 'Data & Storage', icon: Database },
          ].map((item, i) => (
            <button
              key={i}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                item.active 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold uppercase tracking-tight">Appearance & Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Adjust the visual theme of the portal</p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleTheme} className="rounded-full px-6 font-bold uppercase text-[10px] tracking-widest">
                  {theme === 'dark' ? 'Disable' : 'Enable'}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Motion Effects</p>
                  <p className="text-sm text-muted-foreground">Enable hardware-accelerated animations</p>
                </div>
                <div className="w-12 h-6 bg-civic-cyan rounded-full p-1 flex items-center justify-end">
                   <div className="w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold uppercase tracking-tight">Officer Protocol</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Mandatory for all classified data access</p>
                </div>
                <Badge className="bg-civic-green text-white">Active</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold">Biometric Vault</p>
                  <p className="text-sm text-muted-foreground">Store digital signature in secure enclave</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full px-6 font-bold uppercase text-[10px] tracking-widest">Setup</Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
             <Button variant="ghost" className="rounded-full font-bold">Discard Changes</Button>
             <Button className="rounded-full px-8 shadow-lg shadow-primary/20">Save Preferences</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal cn helper if not imported
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default SettingsPage;
