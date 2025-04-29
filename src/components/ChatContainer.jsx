import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStrore";
import ChatHadder from "./ChatHadder";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/userAuthStore";
import { formatMessageTime } from "../lib/utils";

export default function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeToMessages();
  }, [
    getMessages,
    selectedUser._id,
    subscribeToMessages,
    unsubscribeToMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto ">
        <ChatHadder />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  return (
    <div className="flex-1 flex flex-col overflow-auto ">
      <ChatHadder />
      <div className="flex-1 overflow-y-auto  p-4 space-y-4">
        {messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messageEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId == authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profilePic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex  flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="messageImage"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
}
