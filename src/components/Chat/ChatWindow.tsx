import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
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
    const [onboardingStep, setOnboardingStep] = useState<'name' | 'language' | 'completed'>('name');
    const [userName, setUserName] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, isTyping, onboardingStep]);

    const handleOnboardingName = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setUserName(inputValue.trim());
            setInputValue('');
            setOnboardingStep('language');
        }
    };

    const handleOnboardingLanguage = async (lang: string, langName: string) => {
        setSelectedLanguage(langName);
        setOnboardingStep('completed');

        // Initialize chat with personalized greeting
        const greeting = lang === 'si'
            ? `ආයුබෝවන් ${userName}, මම අරුණි. අද ඔබට මගෙන් විය යුත්තේ කුමක්ද?`
            : lang === 'ta'
                ? `வணக்கம் ${userName}, நான் அருணி. இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?`
                : `Hello ${userName}! I'm Aruni. How can I assist you with your TrustBank loans today?`;

        setMessages([{
            id: '1',
            text: greeting,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

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
                    'x-user-name': userName,
                    'x-preferred-language': selectedLanguage
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
                text: `[Error] ${error.message || "Unknown connection error"}. Please check if the backend is running at http://127.0.0.1:5000.`,
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
                    <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Onboarding or Messages Area */}
            <div className="flex-1 p-5 space-y-4 max-h-[400px] overflow-y-auto bg-gray-50/50 min-h-[300px] flex flex-col">
                {onboardingStep === 'name' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-trust-gold/10 rounded-full flex items-center justify-center mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-trust-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h4 className="text-trust-blue font-bold text-lg">Welcome to TrustBank</h4>
                        <p className="text-sm text-gray-600">May I know your name to personalize your experience?</p>
                        <form onSubmit={handleOnboardingName} className="w-full space-y-3">
                            <input
                                autoFocus
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Your Name"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-trust-gold focus:ring-1 focus:ring-trust-gold transition-all text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="w-full bg-trust-blue text-white rounded-xl py-3 font-bold hover:bg-trust-blue/90 transition-colors disabled:opacity-50"
                            >
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {onboardingStep === 'language' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 animate-in fade-in slide-in-from-right-5 duration-300">
                        <h4 className="text-trust-blue font-bold text-lg">Hello, {userName}!</h4>
                        <p className="text-sm text-gray-600">Which language do you prefer to speak in?</p>
                        <div className="w-full space-y-2">
                            <button
                                onClick={() => handleOnboardingLanguage('en', 'English')}
                                className="w-full bg-white border border-gray-200 text-trust-blue rounded-xl py-3 font-medium hover:border-trust-gold hover:text-trust-gold transition-all shadow-sm"
                            >
                                English
                            </button>
                            <button
                                onClick={() => handleOnboardingLanguage('si', 'Sinhala')}
                                className="w-full bg-white border border-gray-200 text-trust-blue rounded-xl py-3 font-medium hover:border-trust-gold hover:text-trust-gold transition-all shadow-sm"
                            >
                                සිංහල (Sinhala)
                            </button>
                            <button
                                onClick={() => handleOnboardingLanguage('ta', 'Tamil')}
                                className="w-full bg-white border border-gray-200 text-trust-blue rounded-xl py-3 font-medium hover:border-trust-gold hover:text-trust-gold transition-all shadow-sm"
                            >
                                தமிழ் (Tamil)
                            </button>
                        </div>
                    </div>
                )}

                {onboardingStep === 'completed' && (
                    <>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm border ${msg.sender === 'user'
                                    ? 'bg-trust-blue text-white rounded-tr-none border-trust-blue'
                                    : 'bg-white text-gray-800 rounded-tl-none border-gray-100'
                                    }`}>
                                    <div className="text-sm prose-sm">
                                        <Markdown
                                            components={{
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                strong: ({ children }) => <span className="font-bold text-trust-blue/90">{children}</span>,
                                                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                            }}
                                        >
                                            {msg.text}
                                        </Markdown>
                                    </div>
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
                    </>
                )}
            </div>

            {/* Input Field (Only visible when onboarding is done) */}
            {onboardingStep === 'completed' && (
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
                </form>
            )}
        </div>
    );
};

export default ChatWindow;
