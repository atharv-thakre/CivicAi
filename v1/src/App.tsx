/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import ComplaintForm from "./components/ComplaintForm";

export default function App() {
  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar for Desktop / Header for Mobile */}
      <aside className="lg:w-[420px] lg:h-screen lg:sticky lg:top-0 bg-white border-b lg:border-b-0 lg:border-r border-border p-8 lg:p-[60px] flex flex-col justify-between shrink-0">
        <div>
          <p className="text-[12px] font-bold text-primary mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            PORTAL v.2.4
          </p>
          <h1 className="huge-title text-ink">
            Voice<span className="text-primary block">Your</span>Action
          </h1>
          
          <div className="mt-10 hidden lg:block">
            <p className="label-caps mb-4">Official Civic Grievance System</p>
            <p className="text-muted text-sm leading-relaxed">
              Empowering citizens to report urban issues with AI-assisted clarity and accurate location tracking.
            </p>
          </div>
        </div>

        <div className="mt-8 lg:mt-auto p-5 bg-[#EFF6FF] rounded-2xl flex items-center gap-4">
          <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_0_4px_rgba(16,185,129,0.2)] shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-ink leading-tight">System Active</p>
            <p className="text-[11px] text-muted font-medium uppercase tracking-wider mt-0.5">Offline Sync Ready • 256-bit Secure</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-bg p-6 lg:p-[60px] flex flex-col justify-center min-h-screen">
        <ComplaintForm />
        
        <footer className="mt-10 lg:mt-16 flex justify-between border-t border-border/50 pt-6 text-[11px] text-muted font-bold uppercase tracking-[0.1em]">
          <span>PWA SECURE</span>
          <span>OFFLINE SYNC ACTIVE</span>
          <span>ENCRYPTED V.2</span>
        </footer>
      </main>
    </div>
  );
}
