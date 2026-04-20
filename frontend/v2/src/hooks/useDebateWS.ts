import { useState, useEffect, useCallback, useRef } from 'react';
import { WSMessage, MessageData } from '../types';

export function useDebateWS(complaintId: string) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const addMsg = useCallback((msg: MessageData) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const showTyping = useCallback((user: string) => {
    setTypingUser(user);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      setTypingUser(null);
    }, 2500);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !complaintId) {
      addMsg({ sender: 'system', message: 'No token or complaint ID found.' });
      return;
    }

    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = "ws://localhost:8000/ws/debate/1?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidWlkIjoiYjIyNWM4NzQtMTM3OS00YWM5LTg1MTEtYmQyMzg4ZTQyOTk0Iiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzc2Njc0MDY2fQ.2Mj1rEtnlWKrsSAbx1w9fcEYYEbusrB1xOT19pd5BCc";
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      addMsg({ sender: 'system', message: 'Connected to Debate Room' });
    };

    ws.onmessage = (event) => {
      const data: WSMessage = JSON.parse(event.data);
      
      if (data.type === 'typing' && data.user) {
        showTyping(data.user);
        return;
      }
      
      if (data.type === 'users') {
        setOnlineUsers(data.users || []);
        setUserCount(data.count || 0);
        return;
      }

      addMsg({
        sender: data.sender,
        message: data.message || data.text || '',
        time: data.time,
        is_mine: data.is_mine
      });
    };

    ws.onclose = () => {
      setIsConnected(false);
      addMsg({ sender: 'system', message: 'Disconnected' });
    };

    return () => {
      ws.close();
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [complaintId, addMsg, showTyping]);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', text }));
    }
  }, []);

  const sendTyping = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing' }));
    }
  }, []);

  return {
    messages,
    onlineUsers,
    userCount,
    typingUser,
    isConnected,
    sendMessage,
    sendTyping
  };
}
