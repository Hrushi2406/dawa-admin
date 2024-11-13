import { useState, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "other";
}

export function useChat(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (chatId) {
      // In a real app, you would fetch messages from an API
      // For now, we'll just simulate it
      const fetchMessages = async () => {
        // Simulate API call
        const dummyMessages = [
          {
            id: "1",
            content: "Hello!",
            timestamp: "10:30 AM",
            sender: "other" as const,
          },
          // Add more messages as needed
        ];
        setMessages(dummyMessages);
      };

      fetchMessages();
    }
  }, [chatId]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);

    // In a real app, you would send the message to an API here
  };

  return {
    messages,
    sendMessage,
  };
}
