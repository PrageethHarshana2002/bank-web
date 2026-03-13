import React from 'react';

interface TypingAnimationProps {
    isVisible: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="flex items-center space-x-1.5 px-4 py-3 bg-gray-100 rounded-2xl w-max">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <span className="ml-2 text-xs text-gray-500 font-medium">Aruni is typing...</span>
        </div>
    );
};

export default TypingAnimation;
