"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, TypeIcon, Image as ImageIcon } from "lucide-react";
import dayjs from "dayjs";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import waService from "@/lib/whatsapp/wa-service";
import wasync from "@/lib/whatsapp/wa-sync-service";
import { toast } from "sonner";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface Chat {
  id: string;
  cname: string;
  cphone: string;
  tags: string[];
  messages: Message[];
}

interface Message {
  id: string;
  from: string;
  timestamp: string;
  type: "text" | "reaction" | "image";
  text?: {
    body: string;
  };
  reaction?: {
    messageId: string;
    emoji: string;
  };
  image?: {
    caption?: string;
    mimeType: string;
    sha256: string;
    id: string;
    url?: string;
  };
}

export default function WhatsAppChat() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = React.useState<Chat | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [imageUpload, setImageUpload] = React.useState<File | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    // Subscribe to chats collection
    const q = query(collection(db, "wasync"), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prevs: Chat[] = chats;
      const updates: Chat[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as Chat;
        updates.push(data);
      });

      setChats([...prevs, ...updates]);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    handleUpdates(chats);
  }, [chats]);

  const handleUpdates = (updates: Chat[]) => {
    if (selectedChat) {
      const newSelectedChat = updates.find(
        (chat) => chat.id === selectedChat.id
      );

      if (newSelectedChat) {
        console.log("updatedSelectedChat: ");
        setSelectedChat(newSelectedChat);
      }
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      from: "user",
      timestamp: dayjs().unix().toString(),
      type: "text",
      text: {
        body: newMessage,
      },
    };
    try {
      await waService.sendWATextMessage(selectedChat?.cphone, newMessage);
      setMessages([...messages, newMsg]);
      setNewMessage("");
      wasync.saveMsg(selectedChat?.cphone, newMsg);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(`Error sending message: ${error}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    try {
      // Upload to Firebase Storage
      const storageRef = ref(
        storage,
        `whatsapp-uploads/${Date.now()}_${file.name}`
      );
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      // Send the image via WhatsApp
      await waService.sendWAMediaMessage(selectedChat.cphone, downloadUrl);

      // Create message object
      const newMsg: Message = {
        id: Date.now().toString(),
        from: "user",
        timestamp: dayjs().unix().toString(),
        type: "image",
        image: {
          id: Date.now().toString(),
          mimeType: file.type,
          sha256: "",
          url: downloadUrl,
        },
      };

      setMessages([...messages, newMsg]);
      wasync.saveMsg(selectedChat.cphone, newMsg);

      // Clear the file input
      setImageUpload(null);
      if (e.target) e.target.value = "";
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error sending image");
    }
  };

  const parseTimestamp = (timestamp: string) => {
    let parsedDate = dayjs.unix(parseInt(timestamp));
    return parsedDate.format("h:mm A");
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
                    {chat.cname}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {chat.cphone}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {chat.messages[chat.messages.length - 1].text?.body ?? ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* {chat.messages[chat.messages.length - 1].tags.map(
                    (tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-100"
                      >
                        {tag}
                      </span>
                    )
                  )} */}
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
                  {selectedChat.cname}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {/* {selectedChat.messages[
                    selectedChat.messages.length - 1
                  ].tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-100"
                    >
                      {tag}
                    </span>
                  ))} */}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e0e7d9] dark:bg-zinc-900">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-b-xl ${
                      message.from === "user"
                        ? "bg-[#dcf8c6] dark:bg-green-900 text-[#303030] dark:text-white 	rounded-tl-xl  "
                        : "bg-white dark:bg-zinc-800 text-[#303030] dark:text-white rounded-tr-xl"
                    }`}
                  >
                    {message.type === "text" && message.text && (
                      <p className="whitespace-pre-wrap break-words">
                        {message.text.body}
                        <span className="text-xs mt-1 text-[#667781] dark:text-zinc-300 text-right pt-4 pl-4">
                          {parseTimestamp(message.timestamp)}
                        </span>
                      </p>
                    )}
                    {message.type === "reaction" && message.reaction && (
                      <p className="text-2xl">{message.reaction.emoji}</p>
                    )}
                    {message.type === "image" && message.image && (
                      <RenderImage
                        url={message.image.url ?? ""}
                        phone={selectedChat.cphone}
                        mediaId={message.image.id}
                      />
                      // <div>
                      //   <img
                      //     src={message.image.url}
                      //     alt={message.image.caption || "Image"}
                      //     className="max-w-full rounded"
                      //   />
                      //   {message.image.caption && (
                      //     <p className="mt-2">{message.image.caption}</p>
                      //   )}
                      // </div>
                    )}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="ghost"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="dark:hover:bg-zinc-700"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
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

const RenderImage = ({
  phone,
  url,
  mediaId,
}: {
  phone: string;
  mediaId: string;
  url: string;
}) => {
  // const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    // retrieveWAMedia(mediaId).then((res) => {
    //   setUrl(URL.createObjectURL(new Blob([res.data], { type: res.mimeType })));
    // });
  }, [mediaId]);

  return <img src={url} alt="Image" />;
};
