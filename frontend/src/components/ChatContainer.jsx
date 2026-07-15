import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageInput from "./MessageInput";

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unsubscribeFromMessages, typingUser, deleteMessage, } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) return;
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"
                  }`}
              >
                <div
                  className={`group chat-bubble relative ${msg.senderId === authUser._id
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-800 text-slate-200"
                    }`}
                >

                  {msg.senderId === authUser._id && (
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      🗑️
                    </button>
                  )}
                  {msg.isDeleted ? (
                    <p className="italic text-gray-300">
                      🚫 This message was deleted
                    </p>
                  ) : (
                    <>
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg h-48 object-cover"
                        />
                      )}
                      {msg.voice && (
                        <audio controls className="mt-2 w-64">
                          <source src={msg.voice} type="audio/webm" />
                          Your browser does not support audio.
                        </audio>
                      )}

                      {msg.text && <p className="mt-2">{msg.text}</p>}
                    </>
                  )}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        )}
      </div>
      {typingUser && (
        <div className="px-8 pb-2 text-sm text-slate-400 italic">
          {selectedUser.fullName} is typing...
        </div>
      )}
      <MessageInput />
    </>
  );
}

export default ChatContainer;