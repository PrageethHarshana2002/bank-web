import React, { useState, useRef, useEffect } from 'react';
import TypingAnimation from './TypingAnimation';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

interface ChatWindowProps {
    onClose: () => void;
    isTyping: boolean;
    onToggleTyping: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, isTyping, onToggleTyping }) => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hello! I'm Aruni, your dedicated finance advisor at TrustBank. How can I assist you with your loan applications today?",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage.text }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server returned ${response.status}`);
            }

            const data = await response.json();


            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error: any) {
            console.error("Failed to send message:", error);
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `[Error] ${error.message || "Unknown connection error"}. Please check if the backend is running at http://127.0.0.1:5000 and your API keys are valid.`,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-trust-blue p-5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-trust-gold flex items-center justify-center font-bold text-trust-blue">
                            A
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-trust-blue rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-bold leading-tight">Advisor Aruni</h3>
                        <span className="text-blue-100 text-xs flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onToggleTyping}
                        title="Toggle Typing (Debug Mode)"
                        className={`p-1.5 rounded-lg transition-colors ${isTyping ? 'bg-trust-gold text-trust-blue' : 'text-blue-100 hover:bg-white/10'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    </button>
                    <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 space-y-4 max-h-[400px] overflow-y-auto bg-gray-50/50 min-h-[300px]">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm border ${msg.sender === 'user'
                            ? 'bg-trust-blue text-white rounded-tr-none border-trust-blue'
                            : 'bg-white text-gray-800 rounded-tl-none border-gray-100'
                            }`}>
                            <p className="text-sm">{msg.text}</p>
                            <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                                {msg.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
                {(isLoading || isTyping) && (
                    <div className="flex justify-start">
                        <TypingAnimation isVisible={true} />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="p-4 bg-white border-t border-gray-100"
            >
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                        placeholder="Type your message..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-trust-gold focus:ring-1 focus:ring-trust-gold transition-all text-sm disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputValue.trim()}
                        className="absolute right-2 p-2 text-trust-blue hover:text-trust-gold transition-colors disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-3">
                    Powered by TrustBank Ethical AI Systems
                </p>
            </form>
        </div>
    );
};

export default ChatWindow;
