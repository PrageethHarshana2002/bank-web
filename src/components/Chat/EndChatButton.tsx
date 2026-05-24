import React, { useState } from 'react';

interface EndChatProps {
    sessionId?: string;
}

const EndChatButton: React.FC<EndChatProps> = ({
    sessionId = 'default-session'
}) => {
    const [isEnding, setIsEnding] = useState(false);

    const handleEndChat = async () => {
        setIsEnding(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
            const response = await fetch(`${backendUrl}/end-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sessionId,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (response.ok) {
                alert("Success: " + (data.message || "Chat ended!"));
            } else {
                alert("Failed: " + (data.error || "Server issue"));
            }
        } catch (error) {
            console.error("Failed to end chat:", error);
            alert("Error contacting the backend to send summary.");
        } finally {
            setIsEnding(false);
        }
    };

    return (
        <button
            onClick={handleEndChat}
            disabled={isEnding}
            title="End Chat Session"
            className="text-xs bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.25)] text-white font-medium px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 flex items-center mr-1"
        >
            {isEnding ? 'Ending...' : 'End Session'}
        </button>
    );
};

export default EndChatButton;
