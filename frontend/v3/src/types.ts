export interface Complaint {
  id: number;
  title: string;
  description: string;
  tags: string[];
  severity: 'low' | 'medium' | 'high';
  location: string;
  date: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  complaintId?: number; // Internal Reference
}

export interface Member {
  id: string;
  name: string;
  status: 'online' | 'offline';
  avatar: string;
}

export interface ChatState {
  activeComplaint: Complaint | null;
  messages: Message[];
  isTyping: boolean;
  members: Member[];
}
