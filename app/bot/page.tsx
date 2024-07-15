"use client";

import React, { useState } from "react";

import { useChat } from "ai/react";
import { Input } from "@/components/ui/input";
import { CoreMessage } from "ai";

export default function Chat() {
  //   const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<CoreMessage[]>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setInput("");
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: input },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: input }],
      }),
    });

    const { messages: newMessages } = await response.json();

    setMessages((currentMessages) => [...currentMessages, ...newMessages]);
  };
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`}>
            <span className="text-sm ">{message.role}: </span>
            {typeof message.content === "string"
              ? message.content
              : message.content
                  .filter((part) => part.type === "text")
                  .map((part, partIndex) => (
                    <div key={partIndex}>{part.type}</div>
                  ))}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
