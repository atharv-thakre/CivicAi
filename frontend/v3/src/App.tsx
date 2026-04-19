import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Menu, 
  Clock,
  Search
} from 'lucide-react';

import { Complaint, Message, ChatState, Member } from './types';
import { mockComplaints } from './data/mockComplaints';
import { injectContext, generateAIResponse } from './utils/aiProcessor';

// Components
import { MessageBubble } from './components/Chat/MessageBubble';
import { InputBar } from './components/Chat/InputBar';
import { ContextBanner } from './components/Chat/ContextBanner';
import { ComplaintSearch } from './components/Complaint/Search';
import { ComplaintCard } from './components/Complaint/Card';
import { MembersList } from './components/Sidebar/MembersList';

export default function App() {
  const [chatState, setChatState] = useState<ChatState>({
    activeComplaint: null,
    messages: [
      {
        id: 'initial',
        role: 'assistant',
        content: "Welcome to the Debate Room. Select a reference topic from the right panel and use **@ai** to get an objective analysis or counter-argument.",
        timestamp: new Date(),
      }
    ],
    isTyping: false,
    members: [
      { id: '1', name: 'John Doe', status: 'online', avatar: '' },
      { id: '2', name: 'Sarah Chen', status: 'online', avatar: '' },
      { id: '3', name: 'James Wilson', status: 'online', avatar: '' },
      { id: '4', name: 'Elena Rodriguez', status: 'online', avatar: '' },
      { id: '5', name: 'Moderator', status: 'online', avatar: '' },
    ]
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Members Sidebar
  const [isReferenceOpen, setIsReferenceOpen] = useState(false); // Complaints Sidebar
  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
        setIsReferenceOpen(true);
      } else {
        setIsSidebarOpen(false);
        setIsReferenceOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isTyping]);

  const handleSendMessage = (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isTyping: true,
    }));

    const internalInput = injectContext(content, chatState.activeComplaint);

    setTimeout(() => {
      const aiResponse = generateAIResponse(internalInput, mockComplaints);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        complaintId: chatState.activeComplaint?.id,
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
        isTyping: false,
      }));
    }, 1500);
  };

  const selectComplaint = (complaint: Complaint) => {
    setChatState(prev => ({
      ...prev,
      activeComplaint: complaint
    }));
  };

  const filteredComplaints = mockComplaints.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col lg:flex-row w-full h-[100dvh] lg:p-4 lg:gap-3.5 overflow-hidden">
      {/* Animated Blobs */}
      <div className="fixed -top-[120px] -left-[120px] w-[500px] h-[500px] rounded-full accent-gradient opacity-[0.18] blur-[80px] pointer-events-none z-0 blob-float" />
      <div className="fixed -bottom-[100px] -right-[100px] w-[400px] h-[400px] rounded-full sky-gradient opacity-[0.18] blur-[80px] pointer-events-none z-0 blob-float [animation-delay:4s]" />

      {/* Backdrop for mobile */}
      {(isSidebarOpen || isReferenceOpen) && isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 15 }}
          onClick={() => {
            setIsSidebarOpen(false);
            setIsReferenceOpen(false);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* LEFT SIDEBAR: MEMBERS */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -240, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -240, opacity: 0 }}
            className={`z-20 h-full shrink-0 ${isMobile ? 'fixed left-0 top-0 bottom-0 p-4' : 'relative'}`}
          >
            <MembersList members={chatState.members} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CHAT AREA */}
      <main id="chat-panel" className="relative z-10 flex-1 glass-panel lg:rounded-[18px] flex flex-col overflow-hidden h-full">
        {/* HEADER */}
        <header id="chat-header" className="h-[66px] border-b border-glass-border bg-white/4 px-4 lg:px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <button 
                onClick={() => {
                  setIsSidebarOpen(!isSidebarOpen);
                  setIsReferenceOpen(false);
                }}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-100"
              >
                <Menu size={20} />
              </button>
            <div id="room-icon" className="w-[34px] lg:w-[38px] h-[34px] lg:h-[38px] rounded-[10px] accent-gradient flex items-center justify-center text-[16px] lg:text-[18px] shadow-[0_4px_14px_rgba(129,140,248,0.4)]">
              💬
            </div>
            <div>
              <h2 className="text-[14px] lg:text-[16px] font-semibold tracking-[0.01em]">Debate Room</h2>
              <p className="hidden xs:block text-[11px] lg:text-[12px] text-slate-100/50 mt-px">Share ideas, argue boldly.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-3">
             <button 
                onClick={() => {
                  setIsReferenceOpen(!isReferenceOpen);
                  setIsSidebarOpen(false);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-100/50"
                title="Toggle Reference Panel"
              >
                <ClipboardList size={20} />
              </button>
            <div id="header-pill" className="flex items-center gap-1.5 text-[11px] lg:text-[12px] font-medium text-slate-100/50 bg-glass border border-glass-border rounded-[20px] px-2.5 lg:px-3.5 py-1 lg:py-1.5">
              <Clock size={11} className="opacity-50" />
              <span id="time-display">{currentTime}</span>
            </div>
          </div>
        </header>

        {/* MESSAGES VIEWPORT */}
        <div className="flex-grow overflow-y-auto relative flex flex-col custom-scrollbar">
          <div className="sticky top-0 z-10 w-full">
            <ContextBanner 
              activeComplaint={chatState.activeComplaint} 
              onClear={() => setChatState(prev => ({ ...prev, activeComplaint: null }))}
            />
          </div>
          
          <div className="flex-grow px-5 py-5 flex flex-col gap-4">
             <div className="flex items-center gap-2.5 text-[11px] text-slate-100/50 my-2">
                <div className="flex-1 h-px bg-glass-border" />
                Today
                <div className="flex-1 h-px bg-glass-border" />
             </div>

             {chatState.messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="p-4 pt-0">
          <InputBar 
            onSendMessage={handleSendMessage} 
            disabled={chatState.isTyping}
          />
        </div>
      </main>

      {/* RIGHT SIDEBAR: REFERENCES (COMPLAINTS) */}
      <AnimatePresence>
        {isReferenceOpen && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            className={`z-20 w-[280px] lg:w-[300px] h-full glass-panel lg:rounded-[18px] flex flex-col overflow-hidden shrink-0 ${isMobile ? 'fixed right-0 top-0 bottom-0 p-4' : 'relative'}`}
          >
             <div className="p-4 border-b border-glass-border">
                <h3 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-100/50 mb-3">
                   Reference Context
                </h3>
                <ComplaintSearch onSearch={setSearchQuery} />
             </div>

             <div className="flex-grow overflow-y-auto p-3 custom-scrollbar">
                {filteredComplaints.map(complaint => (
                  <ComplaintCard 
                    key={complaint.id}
                    complaint={complaint}
                    isActive={chatState.activeComplaint?.id === complaint.id}
                    onSelect={(c) => {
                       selectComplaint(c);
                       if (isMobile) setIsReferenceOpen(false);
                    }}
                  />
                ))}
             </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
