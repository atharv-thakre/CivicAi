import React, { useState, useEffect, useRef } from 'react';

const ScreenReader = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const elementsRef = useRef([]);
  const spaceCountRef = useRef(0);
  const lastSpaceTimeRef = useRef(0);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN'; // Default to Hindi as per previous context, or English? 
    // The user's request is in English but previous context was Hindi. I'll use English for guidance but Hindi support.
    
    // Auto-detect language or just use English for now for navigation instructions
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const getFocusableElements = () => {
    const selector = 'button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';
    const all = Array.from(document.querySelectorAll(selector));
    return all.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
    });
  };

  const highlightElement = (el) => {
    // Remove previous highlights
    elementsRef.current.forEach(item => {
      item.style.outline = '';
      item.style.boxShadow = '';
    });

    if (el) {
      el.focus();
      el.style.outline = '5px solid #3b82f6';
      el.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const tag = el.tagName.toLowerCase();
      const text = el.innerText || el.ariaLabel || el.placeholder || 'Unnamed element';
      let type = 'Element';
      
      if (tag === 'button' || el.getAttribute('role') === 'button') type = 'Button';
      if (tag === 'a') type = 'Link';
      if (tag === 'input') type = 'Input field';

      speak(`${type}: ${text}. Use arrow keys to navigate. Press Enter to activate.`);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      const focusable = getFocusableElements();
      elementsRef.current = focusable;
      setCurrentIndex(0);
      highlightElement(focusable[0]);
    }
  }, [window.location.pathname]); // Re-scan on page change

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle logic: Spacebar 3 times
      if (e.code === 'Space') {
        const now = Date.now();
        if (now - lastSpaceTimeRef.current < 1000) {
          spaceCountRef.current += 1;
        } else {
          spaceCountRef.current = 1;
        }
        lastSpaceTimeRef.current = now;

        if (spaceCountRef.current === 3) {
          e.preventDefault();
          const newState = !isEnabled;
          setIsEnabled(newState);
          spaceCountRef.current = 0;
          
          if (newState) {
            const focusable = getFocusableElements();
            elementsRef.current = focusable;
            setCurrentIndex(0);
            speak("Screen reader mode enabled. Welcome to Civic AI. You can now explore the website using your keyboard. Use the Up and Down arrow keys to move between buttons and links. Press the Enter key to click on an item. Press Escape to exit this mode.");
            setTimeout(() => highlightElement(focusable[0]), 8000); // Wait for intro to finish
          } else {
            speak("Screen reader mode disabled. Standard keyboard navigation restored.");
            elementsRef.current.forEach(item => {
              item.style.outline = '';
              item.style.boxShadow = '';
            });
          }
          return;
        }
      }

      if (!isEnabled) return;

      // Navigation logic
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % elementsRef.current.length;
        setCurrentIndex(nextIndex);
        highlightElement(elementsRef.current[nextIndex]);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + elementsRef.current.length) % elementsRef.current.length;
        setCurrentIndex(prevIndex);
        highlightElement(elementsRef.current[prevIndex]);
      } else if (e.key === 'Enter') {
        // Let the default enter behavior happen or trigger click
        const el = elementsRef.current[currentIndex];
        if (el) {
          speak("Activating " + (el.innerText || 'element'));
        }
      } else if (e.key === 'Escape') {
        setIsEnabled(false);
        speak("Screen reader disabled.");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, currentIndex]);

  return null; // This component has no UI, it's a behavior provider
};

export default ScreenReader;
