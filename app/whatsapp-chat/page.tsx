"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendWATextMessage } from "../api/whatsapp-webhook/whatsapp-service";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  tags: string[];
  messages: Message[];
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "other";
}

export default function WhatsAppChat() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    // Subscribe to chats collection
    const q = query(
      collection(db, "whatsappSync"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chatData.push({
          id: doc.id,
          name: data.name,
          lastMessage: data.lastMessage,
          timestamp: data.timestamp.toDate().toLocaleTimeString(),
          tags: data.tags || [],
          messages: data.messages || [],
        });
      });
      setChats([...chatData]);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "user",
    };
    console.log("selectedChat?.name: ", selectedChat?.name);

    sendWATextMessage(selectedChat?.name, newMessage);

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen">
      {/* Chat List Sidebar */}
      <div className="w-full md:w-1/4 bg-white dark:bg-zinc-900 border-r dark:border-zinc-800">
        <div className="p-4 bg-gray-50 dark:bg-zinc-800 border-b dark:border-zinc-700">
          <h1 className="text-xl font-semibold dark:text-gray-100">Chats</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b dark:border-zinc-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 ${
                selectedChat?.id === chat.id
                  ? "bg-gray-100 dark:bg-zinc-800"
                  : ""
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold dark:text-gray-100">
                    {chat.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {chat.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {chat.lastMessage}
                </p>
                <div className="flex flex-wrap gap-2">
                  {chat.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-col w-3/4 bg-gray-50 dark:bg-zinc-900">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700">
              <div className="flex flex-col gap-2">
                <h2 className="font-semibold dark:text-gray-100">
                  {selectedChat.name}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedChat.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e0e7d9] dark:bg-zinc-900">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-[#dcf8c6] dark:bg-green-900 text-[#303030] dark:text-white"
                        : "bg-white dark:bg-zinc-800 text-[#303030] dark:text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <p className="text-[11px] mt-1 text-[#667781] dark:text-zinc-300 text-right">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700 flex gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 dark:bg-zinc-700 dark:text-white dark:placeholder-gray-400"
              />
              <Button
                type="submit"
                className="dark:bg-green-600 dark:hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
