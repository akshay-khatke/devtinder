import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createSocketConnection } from "../utils/socket.js"
import { useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants.js';
import axios from 'axios';

function Chat() {
    const { targetUserId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector((state) => state.user.userData?._id);
    const userData = useSelector((state) => state.user.userData);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch chat history and target user info
    const fetchMessages = async () => {
        try {
            const chatRes = await axios.get(
                `${BASE_URL}/chat/getChat/${targetUserId}`,
                { withCredentials: true }
            );

            const chatData = chatRes.data?.data;
            const chatMessages = (chatData?.messages || []).map((msg) => ({
                id: msg._id,
                senderId: msg.senderId?._id || msg.senderId,
                firstName: msg.senderId?.firstName || '',
                lastName: msg.senderId?.lastName || '',
                photoUrl: msg.senderId?.photoUrl || '',
                text: msg.message,
                timestamp: msg.createdAt
            }));
            setMessages(chatMessages);

            // Try to get target user info from messages or from connections
            if (chatMessages.length > 0) {
                const otherMsg = chatMessages.find(m => m.senderId !== userId);
                if (otherMsg) {
                    setTargetUser({
                        firstName: otherMsg.firstName,
                        lastName: otherMsg.lastName,
                        photoUrl: otherMsg.photoUrl
                    });
                }
            }

            // Also try fetching from connections
            if (!targetUser) {
                const connRes = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
                const found = connRes.data.data?.find(u => u._id === targetUserId);
                if (found) setTargetUser(found);
            }

        } catch (error) {
            console.error("Failed to fetch chat", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [targetUserId]);

    // Socket connection
    useEffect(() => {
        if (!userId) return;

        socketRef.current = createSocketConnection();

        socketRef.current.emit('joinChat', {
            firstName: userData.firstName,
            userId,
            targetUserId
        });

        socketRef.current.on('messageReceived', ({ firstName, textMessage, senderId, timestamp }) => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    senderId: senderId,
                    firstName,
                    text: textMessage,
                    timestamp: timestamp || new Date().toISOString()
                }
            ]);
        });

        return () => {
            socketRef.current?.off('messageReceived');
        };
    }, [userId, targetUserId]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        socketRef.current.emit('sendMessage', {
            firstName: userData.firstName,
            userId,
            targetUserId,
            textMessage: newMessage
        });

        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const displayName = targetUser
        ? `${targetUser.firstName} ${targetUser.lastName || ''}`
        : 'Chat';

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center flex-none bg-white">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/allchats')}
                        className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors mr-1"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    {targetUser?.photoUrl && (
                        <div className="relative">
                            <img
                                src={targetUser.photoUrl}
                                className="w-11 h-11 rounded-full object-cover shadow-sm border border-gray-50"
                                alt={displayName}
                            />
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
                        </div>
                    )}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">{displayName}</h2>
                        <p className="text-xs text-green-500 font-medium">Online</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </button>
                    <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FCFCFD]">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></svg>
                        </div>
                        <p className="text-gray-400 font-bold text-lg">No messages yet</p>
                        <p className="text-gray-300 text-sm mt-1">
                            Say hi to {targetUser?.firstName || 'them'}! 👋
                        </p>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full space-y-6">
                        <div className="flex justify-center my-4">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/80 px-4 py-1.5 rounded-full">
                                Chat History
                            </span>
                        </div>
                        {messages.map((msg, index) => {
                            const isMe = msg.senderId === userId || msg.firstName === userData.firstName;
                            return (
                                <div
                                    key={msg.id || index}
                                    className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                                >
                                    <img
                                        src={isMe ? userData.photoUrl : (msg.photoUrl || targetUser?.photoUrl)}
                                        className="w-9 h-9 rounded-full shadow-sm border border-gray-50 flex-shrink-0"
                                        alt=""
                                    />
                                    <div className="max-w-[70%]">
                                        <div
                                            className={`px-5 py-3.5 rounded-[26px] text-[15px] font-medium leading-relaxed shadow-sm ${isMe
                                                    ? 'bg-[#5B6BF9] text-white rounded-br-none shadow-[0_5px_15px_rgba(91,107,249,0.3)]'
                                                    : 'bg-[#F2F4F7] text-gray-700 rounded-bl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <p className={`text-[10px] text-gray-300 mt-1.5 ${isMe ? 'text-right' : 'text-left'} px-2`}>
                                            {formatTime(msg.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 pt-4 flex-none bg-white">
                <div className="max-w-5xl mx-auto flex items-center gap-3 bg-[#F2F4F7] p-2 pl-6 pr-2 rounded-full transition-shadow focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 border border-transparent">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        type="text"
                        placeholder={`Message ${targetUser?.firstName || ''}...`}
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[15px]"
                    />
                    <div className="flex items-center gap-0.5">
                        <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45)"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                        </button>
                        <div className="w-[1px] h-6 bg-gray-200 mx-2" />
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className={`p-3 rounded-full shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${newMessage.trim()
                                    ? 'bg-[#5B6BF9] text-white shadow-lg shadow-[#5B6BF9]/30'
                                    : 'bg-white text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-45 ml-0.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;