/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { ChatPanel } from './components/ChatPanel';
import { useDebateWS } from './hooks/useDebateWS';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const complaintId = useMemo(() => {
    const pathParts = window.location.pathname.split("/");
    return pathParts[pathParts.length - 1];
  }, []);

  const {
    messages,
    onlineUsers,
    userCount,
    typingUser,
    sendMessage,
    sendTyping
  } = useDebateWS(complaintId);

  return (
    <div id="app" className="relative z-10 flex h-screen p-2 sm:p-4 gap-2 sm:gap-3.5 overflow-hidden">
      {/* Background Blobs (Subtle for Light Mode) */}
      <motion.div
        animate={{ translate: [0, 40], scale: [1, 1.08] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="fixed top-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.03] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #2563eb, #60a5fa)' }}
      />
      <motion.div
        animate={{ translate: [0, -40], scale: [1, 1.08] }}
        transition={{ duration: 12, delay: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        className="fixed bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03] pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, #0ea5e9, #7dd3fc)' }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex w-full h-full gap-2 sm:gap-3.5">
        {/* Desktop Sidebar (Permanent) */}
        <div className="hidden md:block">
          <Sidebar users={onlineUsers} count={userCount} />
        </div>

        {/* Mobile Sidebar (Overlay) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              />
              {/* Drawer */}
              <motion.div 
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-4 bottom-4 left-4 z-50 md:hidden"
              >
                <Sidebar 
                  users={onlineUsers} 
                  count={userCount} 
                  onClose={() => setIsSidebarOpen(false)} 
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <ChatPanel 
          messages={messages} 
          typingUser={typingUser} 
          sendMessage={sendMessage} 
          sendTyping={sendTyping} 
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />
      </div>
    </div>
  );
}



