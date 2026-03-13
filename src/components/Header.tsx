import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-trust-blue tracking-tight">
                            Trust<span className="text-trust-gold">Bank</span>
                        </span>
                    </div>
                    <nav className="hidden md:flex space-x-10">
                        <a href="#" className="text-base font-medium text-gray-600 hover:text-trust-blue transition-colors">Home</a>
                        <a href="#" className="text-base font-medium text-gray-600 hover:text-trust-blue transition-colors">Loan Products</a>
                        <a href="#" className="text-base font-medium text-gray-600 hover:text-trust-blue transition-colors">Contact</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button className="bg-trust-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md">
                            Client Portal
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
