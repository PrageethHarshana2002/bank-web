import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

const ChatBubble: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // For research project: Toggle typing animation occasionally to demonstrate
    const toggleTyping = () => setIsTyping(!isTyping);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {isOpen && (
                <div className="mb-4">
                    <ChatWindow
                        onClose={() => setIsOpen(false)}
                        isTyping={isTyping}
                        onToggleTyping={toggleTyping}
                    />
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-trust-blue text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 group relative"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-trust-gold rounded-full border-2 border-white animate-pulse"></span>
                    </>
                )}
            </button>
        </div>
    );
};

export default ChatBubble;
