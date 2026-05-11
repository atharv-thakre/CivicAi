import React from 'react';
import { motion } from 'motion/react';
import { Bell, Info, AlertTriangle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const ALERTS = [
  {
    id: 1,
    type: 'CRITICAL',
    title: 'Predicted Water Shortage Escalation',
    description: 'Sector 4 complaints have increased by 40% in the last 2 hours. High probability of cluster failure.',
    time: '12 mins ago',
    icon: ShieldAlert,
    color: 'text-civic-red',
    bg: 'bg-civic-red/10'
  },
  {
    id: 2,
    type: 'SYSTEM',
    title: 'Audit Trail Synced',
    description: 'Master ledger has been successfully updated with 42 new resolved cases from Ward 12.',
    time: '45 mins ago',
    icon: CheckCircle2,
    color: 'text-civic-green',
    bg: 'bg-civic-green/10'
  },
  {
    id: 3,
    type: 'WARNING',
    title: 'Pending Action Plan Delay',
    description: 'Action plan AP-772 has passed its 2-hour update window. Please review current roadblocks.',
    time: '1 hour ago',
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    id: 4,
    type: 'INFO',
    title: 'New Policy Update',
    description: 'New guidelines for AI-assisted classification have been implemented. Review protocol v4.28.',
    time: '3 hours ago',
    icon: Info,
    color: 'text-civic-cyan',
    bg: 'bg-civic-cyan/10'
  }
];

const AlertsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Intelligence Alerts</h1>
          <p className="text-muted-foreground font-medium">Real-time system notifications and priority overrides</p>
        </div>
        <Button variant="outline" className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px]">Mark all as read</Button>
      </div>

      <div className="grid gap-4">
        {ALERTS.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-all duration-300 border-border/50 overflow-hidden cursor-pointer group">
              <div className="flex items-start p-6 gap-6 relative">
                <div className={`p-4 rounded-[20px] ${alert.bg} ${alert.color} group-hover:scale-110 transition-transform duration-500`}>
                  <alert.icon className="w-6 h-6" />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 border-current/20 ${alert.color} ${alert.bg}`}>
                        {alert.type}
                      </Badge>
                      <h3 className="font-bold text-lg tracking-tight">{alert.title}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">{alert.description}</p>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
