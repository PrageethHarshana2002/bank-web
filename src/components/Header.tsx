import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-trust-blue tracking-tight">
                            Lanka Loan <span className="text-trust-gold">Advisor</span>
                        </span>
                    </div>
                    <nav className="hidden md:flex space-x-10">
                        <a href="#home" className="text-base font-medium text-gray-600 hover:text-trust-blue transition-colors">Home</a>
                        <a href="#chatbot" className="text-base font-medium text-gray-600 hover:text-trust-blue transition-colors">Chatbot</a>
                        <a href="#how-it-works" className="text-base font-medium text-gray-600 hover:text-trust-blue transition-colors">How It Works</a>
                        <a href="https://docs.google.com/forms/u/0/d/e/1FAIpQLSeKjKjJUPYBj97yQj4PuPpfpG5TK2_YbL5qrTs83pS4BX6CPg/formResponse" target="_blank" rel="noreferrer" className="text-base font-medium text-gray-600 hover:text-trust-blue transition-colors">Feedback</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))}
                            className="bg-trust-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md"
                        >
                            Try Chatbot
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
