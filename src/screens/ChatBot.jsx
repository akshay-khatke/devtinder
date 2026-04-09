import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants.js';

function ChatBot() {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            text: 'Hello! I am DevTinder Assistant. How can I help you today?',
            isBot: true,
            timestamp: new Date().toISOString()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const userData = useSelector((state) => state.user.userData);

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/chatbot/history`, { withCredentials: true });
            if (response.data.history && response.data.history.length > 0) {
                setMessages(response.data.history);
            }
        } catch (error) {
            console.error("Failed to fetch history:", error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || loading) return;

        const userMsg = {
            id: Date.now(),
            text: newMessage,
            isBot: false,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setNewMessage('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/chatbot/ask`,
                { message: newMessage },
                { withCredentials: true }
            );

            const botMsg = {
                id: Date.now() + 1,
                text: response.data.reply,
                isBot: true,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                text: error.response?.data?.error || "Sorry, I'm having trouble connecting to my brain right now. Please check if the OpenAI API Key is configured.",
                isBot: true,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center flex-none bg-white">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                        AI
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">DevTinder AI Assistant</h2>
                        <p className="text-xs text-blue-500 font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                            Online & Ready to Help
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FCFCFD]">
                <div className="max-w-4xl mx-auto w-full space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-3 ${!msg.isBot ? 'flex-row-reverse' : ''}`}
                        >
                            {msg.isBot ? (
                                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0 border border-blue-50 shadow-sm">
                                    AI
                                </div>
                            ) : (
                                <img
                                    src={userData?.photoUrl || 'https://via.placeholder.com/40'}
                                    className="w-9 h-9 rounded-full shadow-sm border border-gray-50 flex-shrink-0"
                                    alt=""
                                />
                            )}
                            <div className="max-w-[75%]">
                                <div
                                    className={`px-5 py-3.5 rounded-[26px] text-[15px] font-medium leading-relaxed shadow-sm ${!msg.isBot
                                            ? 'bg-gradient-to-br from-[#5B6BF9] to-[#3B4BE9] text-white rounded-br-none shadow-[0_5px_15px_rgba(91,107,249,0.3)]'
                                            : 'bg-[#F2F4F7] text-gray-700 rounded-bl-none border border-gray-100'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <p className={`text-[10px] text-gray-300 mt-1.5 ${!msg.isBot ? 'text-right' : 'text-left'} px-2 font-medium`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center gap-3 text-gray-400 italic px-12 animate-pulse">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                            <span className="text-xs font-medium">Assistant is thinking...</span>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-6 pt-4 flex-none bg-white border-t border-gray-50">
                <div className="max-w-5xl mx-auto flex items-center gap-3 bg-[#F2F4F7] p-2 pl-6 pr-2 rounded-full transition-all duration-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 border border-transparent focus-within:border-blue-100">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        type="text"
                        placeholder="Ask about DevTinder, coding, or connections..."
                        className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-[15px] font-medium py-2"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || loading}
                        className={`p-3 rounded-full shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${newMessage.trim() && !loading
                                ? 'bg-[#5B6BF9] text-white shadow-lg shadow-[#5B6BF9]/30'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="-rotate-45 ml-0.5"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatBot;
