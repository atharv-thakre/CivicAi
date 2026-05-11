import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Menu, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items = [],
  baseColor = "#fff",
  menuColor = "#000",
  buttonBgColor = "#111",
  buttonTextColor = "#fff",
  ease = "easeOut",
  theme = "light"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Framer Motion Variants
  const containerVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <>
      {/* Mobile-style Burger Button */}
      <div className="fixed top-6 right-6 z-[210]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md transition-all border border-white/20"
          style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={containerVariants}
            className="fixed inset-0 z-[200] flex flex-col p-6 md:p-16 lg:p-24 overflow-y-auto"
            style={{ backgroundColor: baseColor }}
          >
            {/* Nav Header */}
            <div className="w-full flex items-center justify-between mb-16 md:mb-24">
              <div className="flex items-center gap-4">
                {logo ? (
                  <img src={logo} alt={logoAlt} className="w-10 h-10 object-contain" />
                ) : (
                  <div className="w-10 h-10 bg-primary rounded-[12px] flex items-center justify-center text-white">
                    <Shield className="w-6 h-6" />
                  </div>
                )}
                <span className="text-xl md:text-2xl font-black tracking-tighter" style={{ color: menuColor }}>
                  {logoAlt}
                </span>
              </div>
            </div>

            {/* Grid layout for items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 h-full max-w-7xl mx-auto w-full pb-20">
              {items.map((item, idx) => (
                <motion.div
                  key={item.label}
                  custom={idx}
                  variants={itemVariants}
                  style={{ backgroundColor: item.bgColor, color: item.textColor }}
                  className="rounded-[32px] md:rounded-[48px] p-8 md:p-12 flex flex-col justify-between min-h-[360px] md:min-h-[480px] shadow-2xl group transition-all duration-500 hover:scale-[1.01]"
                >
                  <div className="space-y-2">
                    <div className="w-12 h-1.5 bg-current opacity-20 rounded-full mb-6" />
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight">
                      {item.label}
                    </h3>
                  </div>

                  <div className="space-y-5 md:space-y-6">
                    {item.links.map((link, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => {
                          if (link.href) {
                            navigate(link.href);
                            setIsOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between text-left group/link"
                      >
                        <span className="text-lg md:text-xl font-bold opacity-60 group-hover/link:opacity-100 transition-all group-hover/link:translate-x-2 duration-300">
                          {link.label}
                        </span>
                        <div className="w-10 h-10 rounded-full border border-current/20 flex items-center justify-center opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Info */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-auto pt-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-current/10 py-10 opacity-30 px-4"
              style={{ color: menuColor }}
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.3em]">
                Civic Core Protocol v4.28
              </div>
              <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
                <span>Terms</span>
                <span>Privacy</span>
                <span>Officer Access Only</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CardNav;
