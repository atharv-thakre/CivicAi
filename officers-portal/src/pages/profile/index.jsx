import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Shield, ShieldAlert, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ProfilePage = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <Avatar className="w-24 h-24 border-2 border-primary/20 p-1">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="text-2xl font-black">SR</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h1 className="text-3xl font-black tracking-tight mb-1">Officer Sharma</h1>
          <p className="text-muted-foreground font-medium mb-3 flex items-center gap-2">
            Senior Field Officer <span className="opacity-30">•</span> ID: OFF-1129
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-civic-cyan/10 text-civic-cyan border-civic-cyan/20">Active Duty</Badge>
            <Badge variant="secondary" className="bg-civic-green/10 text-civic-green border-civic-green/20">Elite Responder</Badge>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20">98% Resolution Rate</Badge>
          </div>
        </div>
        <Button className="rounded-full px-8 shadow-lg shadow-primary/20">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
              <User className="w-5 h-5 text-civic-cyan" />
              Service Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</span>
                <p className="font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4 opacity-50" />
                  sharma.p@civic.gov.in
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contact Number</span>
                <p className="font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4 opacity-50" />
                  +91 9876 543 210
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Assigned Sector</span>
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 opacity-50" />
                  Sector 4, Central District
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Clearance Level</span>
                <p className="font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 opacity-50 text-civic-cyan" />
                  Level 4 Alpha
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
              <Award className="w-5 h-5 text-amber-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Fastest Response', date: 'Oct 2025', color: 'bg-civic-cyan' },
              { label: 'Community Hero', date: 'Dec 2025', color: 'bg-civic-green' },
              { label: 'DSS Specialist', date: 'Jan 2026', color: 'bg-purple-500' }
            ].map((award, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <div className={award.color + " w-10 h-10 rounded-full flex items-center justify-center text-white"}>
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{award.label}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{award.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
