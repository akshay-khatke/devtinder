import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';
import { createSocketConnection } from '../utils/socket.js';

const AllChats = () => {
    const [connections, setConnections] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userData = useSelector((state) => state.user.userData);
    const userId = userData?._id;

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const prevSelectedRef = useRef(null);

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 1. Fetch all connections on mount
    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });
                setConnections(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch connections", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConnections();
    }, []);

    // 2. When a user is selected, fetch chat history + join socket room
    useEffect(() => {
        if (!selectedUser || !userId) return;

        const targetUserId = selectedUser._id;

        // Fetch existing messages
        const fetchChatHistory = async () => {
            setChatLoading(true);
            try {
                const response = await axios.get(
                    `${BASE_URL}/chat/getChat/${targetUserId}`,
                    { withCredentials: true }
                );
                const chatData = response.data?.data;
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
            } catch (error) {
                console.error("Failed to fetch chat", error);
                setMessages([]);
            } finally {
                setChatLoading(false);
            }
        };

        fetchChatHistory();

        // Socket setup
        socketRef.current = createSocketConnection();

        // Leave previous room if switching chats
        //if this condition not added then multiple listner will be attached to the socket
        //and when a message is received it will be added multiple times to the messages array
        if (prevSelectedRef.current && prevSelectedRef.current !== targetUserId) {
            socketRef.current.off('messageReceived');
        }
        prevSelectedRef.current = targetUserId;

        // Join the chat room
        socketRef.current.emit('joinChat', {
            firstName: userData.firstName,
            userId,
            targetUserId
        });

        // Listen for incoming messages
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
    }, [selectedUser, userId]);

    // 3. Send message via socket
    const sendMessage = () => {
        if (!newMessage.trim() || !selectedUser) return;

        socketRef.current.emit('sendMessage', {
            firstName: userData.firstName,
            userId,
            targetUserId: selectedUser._id,
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

    // Filter connections by search
    const filteredConnections = connections.filter((c) =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format timestamp
    const formatTime = (ts) => {
        if (!ts) return '';
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full bg-[#F5F7FA] overflow-hidden select-none">
            {/* ===== LEFT SIDEBAR: Connections List ===== */}
            <div className="w-[400px] flex flex-col bg-white border-r border-gray-100 shadow-sm">
                {/* Header */}
                <div className="p-6 pb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Chat</h1>
                    <div className="flex gap-2">
                        <button className="p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <ArchiveIcon />
                        </button>
                        <button className="p-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <SettingsIcon />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="px-5 pb-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search connections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 rounded-2xl py-3 pl-10 pr-4 text-sm border border-transparent focus:ring-2 focus:ring-[#5B6BF9]/20 focus:bg-white focus:border-[#5B6BF9]/30 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Connections List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    {filteredConnections.length === 0 && (
                        <div className="text-center py-16 px-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ChatEmptyIcon />
                            </div>
                            <p className="text-gray-400 font-medium">No connections found</p>
                            <p className="text-gray-300 text-sm mt-1">Start connecting to chat!</p>
                        </div>
                    )}
                    {filteredConnections.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`flex items-center gap-4 p-4 rounded-[24px] cursor-pointer transition-all duration-200 ${selectedUser?._id === user._id
                                ? 'bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50'
                                : 'hover:bg-gray-50'
                                }`}
                        >
                            <div className="relative">
                                <img
                                    src={user.photoUrl}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                    alt={user.firstName}
                                />
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className={`font-bold truncate ${selectedUser?._id === user._id ? 'text-gray-900' : 'text-gray-700'
                                        }`}>
                                        {user.firstName} {user.lastName}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-400 truncate">
                                    {user.about || 'Available for chat'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== RIGHT SIDE: Chat Area ===== */}
            {selectedUser ? (
                <div className="flex-1 flex flex-col bg-white">
                    {/* Chat Header */}
                    <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center flex-none">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={selectedUser.photoUrl}
                                    className="w-11 h-11 rounded-full object-cover shadow-sm border border-gray-50"
                                    alt={selectedUser.firstName}
                                />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {selectedUser.firstName} {selectedUser.lastName}
                                </h2>
                                <p className="text-xs text-green-500 font-medium">Online</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                                <SearchIcon size={20} />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                                <MoreIcon size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FCFCFD]">
                        {chatLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <span className="loading loading-dots loading-lg text-gray-300"></span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <WaveIcon />
                                </div>
                                <p className="text-gray-400 font-bold text-lg">No messages yet</p>
                                <p className="text-gray-300 text-sm mt-1">
                                    Say hi to {selectedUser.firstName}! 👋
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center my-4">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/80 px-4 py-1.5 rounded-full">
                                        Chat History
                                    </span>
                                </div>
                                <div className="max-w-4xl mx-auto w-full space-y-6">
                                    {messages.map((msg, index) => {
                                        const isMe = msg.senderId === userId || msg.firstName === userData.firstName;
                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                                            >
                                                <img
                                                    src={isMe ? userData.photoUrl : (msg.photoUrl || selectedUser.photoUrl)}
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
                            </>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="p-6 pt-4 flex-none">
                        <div className="max-w-5xl mx-auto flex items-center gap-3 bg-[#F2F4F7] p-2 pl-6 pr-2 rounded-full transition-shadow focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 border border-transparent">
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                type="text"
                                placeholder={`Message ${selectedUser.firstName}...`}
                                className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[15px]"
                            />
                            <div className="flex items-center gap-0.5">
                                <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                                    <EmojiIcon />
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                                    <AttachIcon />
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
                                    <SendIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* No chat selected placeholder */
                <div className="flex-1 flex flex-col items-center justify-center bg-white">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <ChatEmptyIcon size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-400">Select a conversation</h2>
                    <p className="text-gray-300 mt-2 text-sm">
                        Choose a connection from the left to start chatting
                    </p>
                </div>
            )}
        </div>
    );
};

// ===== SVG Icons =====
const ArchiveIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8" /><path d="M1 3h22v5H1z" /><path d="M10 12h4" /></svg>
);
const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>
);
const SearchIcon = ({ size = 16, className = '' }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const MoreIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
);
const EmojiIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
);
const AttachIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45)"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
);
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-45 ml-0.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
);
const ChatEmptyIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const WaveIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 10h.01" /><path d="M12 10h.01" /><path d="M16 10h.01" /></svg>
);

export default AllChats;