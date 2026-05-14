import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Mic, X, RotateCcw, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../constants';

const VoiceCompanion = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, recording, processing, confirming, success, error
  const [transcript, setTranscript] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [complaintId, setComplaintId] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const recognitionRef = useRef(null);
  const wakeLockRef = useRef(null);
  const shakeCountRef = useRef(0);
  const lastShakeTimeRef = useRef(0);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Helper to get location
  const getGeolocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve("Location not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => resolve("Location denied"),
        { timeout: 5000 }
      );
    });
  };

  // TTS Helper
  const speak = (text, onEnd) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') && v.name.toLowerCase().includes('female')) || 
                       voices.find(v => v.lang.includes('hi'));
    if (hindiVoice) utterance.voice = hindiVoice;
    
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  };

  // Shake Detection Logic
  useEffect(() => {
    const handleMotion = (event) => {
      const { x, y, z } = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const threshold = 15;
      const now = Date.now();

      if (acceleration > threshold) {
        if (now - lastShakeTimeRef.current > 200) {
          if (now - lastShakeTimeRef.current > 5000) {
            shakeCountRef.current = 1;
          } else {
            shakeCountRef.current += 1;
          }
          lastShakeTimeRef.current = now;

          if (shakeCountRef.current >= 3) {
            activateCompanion();
            shakeCountRef.current = 0;
          }
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isActive]);

  const activateCompanion = async () => {
    if (isActive) return;
    
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.warn('Wake Lock failed', err);
    }

    setIsActive(true);
    updateStatus('recording');
    speak("Namaste! Main Civic AI hoon. Apni shikayat boliye 30 second mein, aur apna address bataye.", () => {
      startSTT();
    });
  };

  const transcriptRef = useRef('');
  const statusRef = useRef('idle');

  // Update status and statusRef together
  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    statusRef.current = newStatus;
  };

  const startSTT = (isConfirmation = false) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      handleAppError("unclear");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = !isConfirmation;
    recognition.interimResults = true;

    transcriptRef.current = '';
    recognition.onresult = (event) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        fullTranscript += event.results[i][0].transcript;
      }
      transcriptRef.current = fullTranscript;
      setTranscript(fullTranscript);
    };

    recognition.onend = () => {
      // Small delay to ensure all onresult events are processed
      setTimeout(() => {
        if (statusRef.current === 'recording' && !isConfirmation) {
          const text = transcriptRef.current.trim();
          if (text.length > 0) {
            handleRecordingComplete(text);
          } else {
            handleAppError("no_speech");
          }
        }
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error('STT Error:', event.error);
      if (event.error === 'network') handleAppError("network");
      // Other errors like 'no-speech' are handled by our timer/onend
    };

    recognition.start();
    recognitionRef.current = recognition;

    if (!isConfirmation) {
      setCountdown(30);
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timerRef.current);
            if (recognitionRef.current) {
              try {
                recognitionRef.current.stop();
              } catch (e) {
                recognitionRef.current.abort();
              }
            }
            // Force end if onend doesn't fire within 2s
            setTimeout(() => {
              if (statusRef.current === 'recording') {
                handleRecordingComplete(transcriptRef.current);
              }
            }, 2000);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
  };

  const handleRecordingComplete = (text) => {
    clearInterval(timerRef.current);
    updateStatus('confirming');
    speak(`Shukriya! Aapki shikayat record ho gayi. Aapne kaha: ${text}. Sahi hai? Haan boliye ya Nahin.`, () => {
      listenForConfirmation(text);
    });
  };

  const listenForConfirmation = (originalText) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toLowerCase();
      if (result.includes('haan') || result.includes('yes') || result.includes('sahi') || result.includes('han')) {
        submitComplaint(originalText);
      } else if (result.includes('nahin') || result.includes('no') || result.includes('galat') || result.includes('nahi')) {
        speak("Theek hai. Dobara boliye.", () => {
          updateStatus('recording');
          startSTT();
        });
      }
    };

    recognition.start();
  };

  const submitComplaint = async (text) => {
    updateStatus('processing');
    try {
      const location = await getGeolocation();
      const response = await fetch(`${API_BASE_URL}/ai/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'msg': text
        },
        body: JSON.stringify({
          complaint_text: text,
          source: 'voice_companion',
          language_detected: 'hi-IN',
          timestamp: new Date().toISOString(),
          location: location,
          shake_triggered: true,
          session_duration_ms: 30000
        })
      });

      if (!response.ok) throw new Error('API_ERROR');
      const data = await response.json();
      setComplaintId(data.complaint_id || `GR-${Math.floor(10000 + Math.random() * 90000)}`);
      updateStatus('success');
      speak(`Aapki shikayat darj ho gayi. Shukriya!`);
      
      setTimeout(() => closeCompanion(), 5000);
    } catch (err) {
      handleAppError("api");
    }
  };

  const handleAppError = (type) => {
    setErrorType(type);
    updateStatus('error');
    clearInterval(timerRef.current);
    
    const messages = {
      network: "Internet slow hai. Kripaya thodi der baad koshish karein.",
      api: "Server mein dikkat hai. Hamari team ko suchit kar diya gaya.",
      location: "Aapka pata nahi mila. Address manually batayein.",
      unclear: "Aapki awaaz saaf nahi aayi. Kareeb se boliye.",
      no_speech: "Kripaya dobara koshish karein. Phone ko dobara hilaayein."
    };
    
    speak(messages[type] || "Kuch galat hua.");
  };

  const closeCompanion = () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    if (wakeLockRef.current) wakeLockRef.current.release();
    clearInterval(timerRef.current);
    setIsActive(false);
    updateStatus('idle');
    setTranscript('');
    setComplaintId(null);
    setErrorType(null);
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="max-w-sm w-full space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary relative">
              <BrainCircuit size={40} className="animate-pulse" />
              {status === 'recording' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0.2 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-primary rounded-full"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Civic AI Saathi</h2>
          </div>

          {/* Main Status Area */}
          <div className="min-h-[160px] flex flex-col items-center justify-center gap-4">
            {status === 'recording' && (
              <>
                <div className="flex items-center gap-3 text-red-500 font-bold animate-pulse">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  🎙️ Recording... 00:{countdown.toString().padStart(2, '0')}
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '100%' }}
                    animate={{ width: `${(countdown / 30) * 100}%` }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-lg font-medium italic opacity-80">"{transcript || "Listening..."}"</p>
              </>
            )}

            {status === 'processing' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-xl font-bold">Processing...</p>
              </div>
            )}

            {status === 'confirming' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground uppercase font-bold tracking-widest">Verify Complaint</p>
                <p className="text-xl font-medium leading-relaxed italic">"{transcript}"</p>
                <div className="flex justify-center gap-4 pt-4">
                   <div className="px-6 py-2 rounded-full bg-primary/10 text-primary font-bold">Boliye "Haan" / "Nahin"</div>
                </div>
              </div>
            )}

            {status === 'success' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 text-civic-green"
              >
                <CheckCircle2 size={60} />
                <div>
                  <p className="text-2xl font-bold">Shikayat Darj!</p>
                  <p className="text-lg font-mono mt-2">{complaintId}</p>
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4 text-destructive">
                <AlertCircle size={60} />
                <p className="text-xl font-bold leading-relaxed">
                  {errorType === 'network' && "Internet slow hai. Kripaya thodi der baad koshish karein."}
                  {errorType === 'api' && "Server mein dikkat hai. Hamari team ko suchit kar diya gaya."}
                  {errorType === 'unclear' && "Aapki awaaz saaf nahi aayi. Kareeb se boliye."}
                  {errorType === 'no_speech' && "Kripaya dobara koshish karein. Phone ko dobara hilaayein."}
                </p>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col gap-4">
             <div className="flex justify-center gap-6">
                {status === 'recording' && (
                  <button onClick={() => recognitionRef.current?.stop()} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                      <X size={24} />
                    </div>
                    <span className="text-xs font-bold uppercase">Stop</span>
                  </button>
                )}
                {(status === 'error' || status === 'confirming') && (
                  <button onClick={() => { updateStatus('recording'); startSTT(); }} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <RotateCcw size={24} />
                    </div>
                    <span className="text-xs font-bold uppercase">Retry</span>
                  </button>
                )}
             </div>
             <button 
              onClick={closeCompanion}
              className="text-muted-foreground text-sm font-bold uppercase tracking-widest pt-8"
             >
               Exit Saathi Mode
             </button>
          </div>

          <div className="text-[10px] text-muted-foreground pt-4 border-t border-border">
             💡 Tip: Speak clearly in Hindi or English
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceCompanion;
