import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, ShieldCheck, Award, Calendar, BadgeCheck, Target, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const ProfilePage = () => {
  const { state } = useApp();
  const user = state.user || {};
  const name = user.name || 'Officer Sharma';
  const uid = user.uid ? user.uid.slice(0, 8).toUpperCase() : 'OFF-1129';
  const email = user.email || 'sharma.p@civic.gov.in';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-6 ios-glass p-8 rounded-[32px] border border-border/50 shadow-sm"
      >
        <Avatar className="w-24 h-24 border-2 border-primary/20 p-1 ring-4 ring-primary/5">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.handle || email}`} />
          <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-grow space-y-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1">{name}</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-primary" />
              Senior Field Officer <span className="opacity-30">•</span> ID: {uid}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-civic-cyan/10 text-civic-cyan border-civic-cyan/20">Active Duty</Badge>
            <Badge variant="secondary" className="bg-civic-green/10 text-civic-green border-civic-green/20">Elite Responder</Badge>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">98% Resolution Rate</Badge>
          </div>
        </div>
        <Button className="rounded-full px-8 shadow-lg shadow-primary/20 gap-2">
          <User className="w-4 h-4" /> Edit Profile
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Information */}
        <Card className="lg:col-span-2 shadow-sm border-border/50 rounded-[28px] overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
              <User className="w-5 h-5 text-civic-cyan" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</span>
                <p className="font-medium flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {email}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contact Number</span>
                <p className="font-medium flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  +91 9876 543 210
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Sector</span>
                <p className="font-medium flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Sector 4, Central District
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Clearance Level</span>
                <p className="font-medium flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <ShieldCheck className="w-4 h-4 text-civic-cyan" />
                  Level 4 Alpha
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date Joined</span>
                <p className="font-medium flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  March 2022
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cases Resolved</span>
                <p className="font-medium flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                  <Target className="w-4 h-4 text-civic-green" />
                  186 Complaints
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-sm border-border/50 rounded-[28px] overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
              <Award className="w-5 h-5 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { label: 'Fastest Response', desc: 'Sub 4-min activation', date: 'Oct 2025', color: 'bg-civic-cyan', icon: TrendingUp },
              { label: 'Community Hero', desc: '50+ positive reviews', date: 'Dec 2025', color: 'bg-civic-green', icon: BadgeCheck },
              { label: 'DSS Specialist', desc: 'Advanced AI ops certified', date: 'Jan 2026', color: 'bg-purple-500', icon: Target }
            ].map((award, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/20 transition-all group"
              >
                <div className={cn(award.color, "w-11 h-11 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform")}>
                  <award.icon className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold">{award.label}</p>
                  <p className="text-[10px] text-muted-foreground">{award.desc}</p>
                  <p className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider mt-0.5">{award.date}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;