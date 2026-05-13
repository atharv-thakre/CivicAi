import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Priority } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const NotificationReminder = () => {
  const { state } = useApp();
  const [activeSevereComplaints, setActiveSevereComplaints] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const checkSevereComplaints = useCallback(() => {
    const severe = state.complaints.filter(
      c => c.priority === Priority.CRITICAL && c.status !== 'RESOLVED'
    );
    if (severe.length > 0) {
      setActiveSevereComplaints(severe);
      setShowNotification(true);
      
      // Auto hide after 15 seconds to not be too intrusive
      setTimeout(() => setShowNotification(false), 15000);
      
      // Request browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('Severe Complaint Reminder', {
          body: `You have ${severe.length} severe complaint(s) requiring immediate attention.`,
          icon: '/favicon.ico'
        });
      }
    }
  }, [state.complaints]);

  useEffect(() => {
    // Request notification permission on mount
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Initial check
    checkSevereComplaints();

    // Set interval for 10 minutes
    const interval = setInterval(checkSevereComplaints, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSevereComplaints]);

  return (
    <AnimatePresence>
      {showNotification && activeSevereComplaints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed bottom-6 right-6 z-[100] w-96 overflow-hidden"
        >
          <div className="bg-background border-2 border-civic-red/50 shadow-2xl rounded-2xl p-0 ios-glass overflow-hidden">
            <div className="bg-civic-red/10 p-4 flex items-center justify-between border-b border-civic-red/20">
              <div className="flex items-center gap-2 text-civic-red font-black text-xs uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" />
                Severe Alert Reminder
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium leading-relaxed">
                  You have <span className="text-civic-red font-bold">{activeSevereComplaints.length} critical complaints</span> that need your immediate action. 
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeSevereComplaints.slice(0, 2).map(c => (
                    <Badge key={c.id} variant="outline" className="bg-civic-red/5 text-civic-red border-civic-red/20 font-bold text-[10px]">
                      {c.id}
                    </Badge>
                  ))}
                  {activeSevereComplaints.length > 2 && (
                    <Badge variant="outline" className="text-[10px] font-bold">
                      +{activeSevereComplaints.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={() => {
                    navigate('/complaints');
                    setShowNotification(false);
                  }}
                  className="flex-grow bg-civic-red hover:bg-civic-red/90 text-white font-bold text-xs uppercase tracking-widest h-10"
                >
                  Review Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowNotification(false)}
                  className="px-3 h-10 border-border hover:bg-secondary"
                >
                  Dismiss
                </Button>
              </div>
            </div>
            
            <div className="h-1 bg-civic-red/20 w-full">
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 15, ease: "linear" }}
                className="h-full bg-civic-red"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationReminder;
