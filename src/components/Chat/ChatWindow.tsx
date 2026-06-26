import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import TypingAnimation from './TypingAnimation';
import EndChatButton from './EndChatButton';
import EmojiPicker from 'emoji-picker-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

interface ChatWindowProps {
    onClose?: () => void;
    isTyping: boolean;
    onToggleTyping: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, isTyping }) => {
    const [inputValue, setInputValue] = useState('');
    const [onboardingStep, setOnboardingStep] = useState<'name' | 'language' | 'completed'>('name');
    const [userName, setUserName] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const onEmojiClick = (emojiObject: any) => {
        setInputValue(prevInput => prevInput + emojiObject.emoji);
    };

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
                : `Hello ${userName}! I'm Aruni. How can I assist you with your personal loans today?`;

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
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
            const response = await fetch(`${backendUrl}/chat`, {
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
            console.error("Detailed Chat Error:", error);
            
            let userFriendlyMessage = "I'm sorry, I'm experiencing a temporary connection issue. Please try again in a moment. 🔌";
            
            // Check if it's a quota/rate limit error
            if (error.message && (error.message.includes("limit") || error.message.includes("429") || error.message.includes("Quota"))) {
                userFriendlyMessage = "I'm experiencing a bit of high traffic right now and need a short break. Please try asking me again in a minute! ⏳";
            } else if (error.message && error.message.includes("503")) {
                userFriendlyMessage = "I am still waking up! Please give me a few seconds and try again. 🌅";
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: userFriendlyMessage,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
                return;
            }

            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            
            let langCode = 'en-US';
            if (selectedLanguage === 'Sinhala') langCode = 'si-LK';
            else if (selectedLanguage === 'Tamil') langCode = 'ta-LK';
            rec.lang = langCode;

            rec.onstart = () => {
                setIsListening(true);
            };

            rec.onend = () => {
                setIsListening(false);
            };

            rec.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    alert("Microphone access blocked. Please enable microphone permissions in your browser settings.");
                }
            };

            rec.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                if (transcript) {
                    setInputValue(prev => {
                        const trimmed = prev.trim();
                        return trimmed ? `${trimmed} ${transcript}` : transcript;
                    });
                }
            };

            recognitionRef.current = rec;
            rec.start();
        }
    };

    return (
        <div className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-trust-blue p-5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <img 
                            src="/aruni.jpg" 
                            alt="Aruni" 
                            className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
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
                    {onboardingStep === 'completed' && <EndChatButton sessionId="default-session" />}
                    {onClose && (
                        <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Onboarding or Messages Area */}
            <div className="flex-1 p-5 space-y-4 max-h-[400px] overflow-y-auto bg-gray-50/50 min-h-[300px] flex flex-col">
                {onboardingStep === 'name' && (
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <img 
                            src="/aruni.jpg" 
                            alt="Advisor Aruni" 
                            className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-trust-gold/20 mb-2"
                        />
                        <h4 className="text-trust-blue font-bold text-lg">Welcome to Lanka Loan Advisor</h4>
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
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && (
                                    <img 
                                        src="/aruni.jpg" 
                                        alt="Aruni" 
                                        className="w-8 h-8 rounded-full object-cover border border-gray-100 flex-shrink-0"
                                    />
                                )}
                                <div className={`max-w-[78%] p-3.5 rounded-2xl shadow-sm border ${msg.sender === 'user'
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
                            <div className="flex items-end gap-2 justify-start">
                                <img 
                                    src="/aruni.jpg" 
                                    alt="Aruni" 
                                    className="w-8 h-8 rounded-full object-cover border border-gray-100 flex-shrink-0"
                                />
                                <TypingAnimation isVisible={true} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Field (Only visible when onboarding is done) */}
            {onboardingStep === 'completed' && (
                <div className="relative">
                    {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 mb-2 z-50">
                            <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                        </div>
                    )}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); setShowEmojiPicker(false); }}
                        className="p-4 bg-white border-t border-gray-100"
                    >
                        <div className="relative flex items-center">
                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="absolute left-2 p-2 text-gray-400 hover:text-trust-gold transition-colors z-10"
                                title="Add Emoji"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isLoading}
                                placeholder={isListening ? "Listening..." : "Type your message..."}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-20 py-3 focus:outline-none focus:border-trust-gold focus:ring-1 focus:ring-trust-gold transition-all text-sm disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`absolute right-10 p-2 transition-colors ${
                                    isListening 
                                        ? 'text-red-500 animate-pulse' 
                                        : 'text-gray-400 hover:text-trust-blue'
                                }`}
                                title={isListening ? "Listening... Click to stop" : "Voice Input"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            </button>
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
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
