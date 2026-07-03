import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import UsersLoadingSkeleton from './UserLoadingStructure';
import NoChatsFound from './NoChatsFound';
import { useAuthStore } from '../store/useAuthStore';

function ChatList() {
    const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
    const {onlineUsers}=useAuthStore();
    useEffect(() => {
        getMyChatPartners()
    }, [getMyChatPartners]);
    if (isUsersLoading) return <UsersLoadingSkeleton />;
    if (chats.length === 0) return <NoChatsFound />;
    return (
        <>
            {chats.map((chat) => (
                <div
                    key={chat._id}
                    className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
                    onClick={() => setSelectedUser(chat)}
                >
                    <div className="flex items-center gap-3">
                        <div className={`avatar ${onlineUsers.includes(chat._id)?"online":"offline"}`}>
                            <div className="size-12 rounded-full overflow-hidden">
                                <img
                                    src={chat.profilePhoto || "/avathar.jpg"}
                                    alt={chat.fullName}
                                    className="size-full object-cover"
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-slate-200 font-medium truncate">
                                {chat.fullName}
                            </h4>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default ChatList
