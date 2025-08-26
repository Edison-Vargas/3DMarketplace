import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  participantNames: { [userId: string]: string };
  lastMessage?: ChatMessage;
  unreadCount: number;
}

interface ChatContextType {
  conversations: ChatConversation[];
  messages: { [conversationId: string]: ChatMessage[] };
  sendMessage: (receiverId: string, receiverName: string, message: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversation: (userId1: string, userId2: string) => ChatConversation | null;
  createConversation: (userId1: string, userName1: string, userId2: string, userName2: string) => string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: ChatMessage[] }>({});

  useEffect(() => {
    const storedConversations = localStorage.getItem('marketplace3d_conversations');
    const storedMessages = localStorage.getItem('marketplace3d_messages');
    
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
    
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('marketplace3d_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('marketplace3d_messages', JSON.stringify(messages));
  }, [messages]);

  const getConversation = (userId1: string, userId2: string): ChatConversation | null => {
    return conversations.find(conv => 
      conv.participants.includes(userId1) && conv.participants.includes(userId2)
    ) || null;
  };

  const createConversation = (userId1: string, userName1: string, userId2: string, userName2: string): string => {
    const existingConv = getConversation(userId1, userId2);
    if (existingConv) return existingConv.id;

    const newConversation: ChatConversation = {
      id: Date.now().toString(),
      participants: [userId1, userId2],
      participantNames: {
        [userId1]: userName1,
        [userId2]: userName2
      },
      unreadCount: 0
    };

    setConversations(current => [...current, newConversation]);
    return newConversation.id;
  };

  const sendMessage = (receiverId: string, receiverName: string, message: string) => {
    const currentUser = JSON.parse(localStorage.getItem('marketplace3d_user') || '{}');
    if (!currentUser.id) return;

    let conversationId = getConversation(currentUser.id, receiverId)?.id;
    
    if (!conversationId) {
      conversationId = createConversation(currentUser.id, currentUser.name, receiverId, receiverName);
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId,
      message,
      timestamp: new Date(),
      read: false
    };

    setMessages(current => ({
      ...current,
      [conversationId!]: [...(current[conversationId!] || []), newMessage]
    }));

    setConversations(current =>
      current.map(conv =>
        conv.id === conversationId
          ? { 
              ...conv, 
              lastMessage: newMessage,
              unreadCount: conv.unreadCount + (newMessage.senderId !== currentUser.id ? 1 : 0)
            }
          : conv
      )
    );
  };

  const markAsRead = (conversationId: string) => {
    setConversations(current =>
      current.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );

    setMessages(current => ({
      ...current,
      [conversationId]: (current[conversationId] || []).map(msg => ({ ...msg, read: true }))
    }));
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      messages,
      sendMessage,
      markAsRead,
      getConversation,
      createConversation
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}