// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Типы для событий
interface ServerToClientEvents {
  message: (data: MessageData) => void;
  userConnected: (userId: string) => void;
  userDisconnected: (userId: string) => void;
  notification: (notification: Notification) => void;
  error: (error: SocketError) => void;
}

interface ClientToServerEvents {
  message: (data: MessageData) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  typing: (data: TypingData) => void;
  disconnect: () => void;
}

interface MessageData {
  id: string;
  text: string;
  userId: string;
  timestamp: Date;
  roomId?: string;
}

interface TypingData {
  userId: string;
  isTyping: boolean;
  roomId?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface SocketError {
  code: string;
  message: string;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

interface SocketContextType {
  socket: SocketType | null;
  isConnected: boolean;
  connect: (token?: string) => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = (token?: string) => {
    if (socket?.connected) return;

    // Создание подключения с опциями
    const socketInstance = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5173/', {
      auth: token ? { token } : undefined,
      transports: ['websocket', 'polling'], // WebSocket с fallback на polling
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        clientType: 'web',
        version: '1.0.0',
      },
    });

    // Обработчики событий подключения
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error.message);
    });

    setSocket(socketInstance);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  // Автоматическое подключение при монтировании
  useEffect(() => {
    // Подключаемся при наличии токена
    const token = localStorage.getItem('authToken');
    if (token) {
      connect(token);
    }

    // Очистка при размонтировании
    return () => {
      disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};