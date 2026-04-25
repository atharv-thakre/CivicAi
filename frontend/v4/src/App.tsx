/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Overview from './components/dashboard/Overview';
import ComplaintList from './components/dashboard/ComplaintList';
import DSS from './components/dashboard/DSS';
import Analytics from './components/dashboard/Analytics';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'complaints': return <ComplaintList />;
      case 'dss': return <DSS />;
      case 'analytics': return <Analytics />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-16 h-16 glass rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-2xl font-bold">?</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Module Under Construction</h3>
            <p className="text-slate-400">This module is currently being optimized by Civic AI.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex bg-slate-950 h-screen font-sans text-slate-100 overflow-hidden relative">
      {/* Background Mesh Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] bg-emerald-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

      <div className="flex h-full w-full p-6 gap-6 relative z-10 w-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto pt-6 custom-scrollbar">
            <div className="mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

