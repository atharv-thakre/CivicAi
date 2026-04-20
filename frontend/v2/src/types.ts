export interface User {
  name: string;
  avatarColor: UserColor;
}

export interface UserColor {
  bg: string;
  text: string;
  light: string;
  hex: string;
}

export interface MessageData {
  sender?: string;
  message: string;
  time?: string;
  is_mine?: boolean;
}

export interface WSMessage {
  type: 'typing' | 'users' | 'message';
  user?: string;
  users?: string[];
  count?: number;
  sender?: string;
  message?: string;
  time?: string;
  is_mine?: boolean;
  text?: string;
}
