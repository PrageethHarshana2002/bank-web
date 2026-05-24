import React from 'react';

const Hero: React.FC = () => {
    return (
        <div className="relative bg-white overflow-hidden border-b border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-trust-blue sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Your Personal</span>{' '}
                                <span className="block text-trust-gold xl:inline font-serif italic">AI Loan Advisor</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Navigate personal loans in Sri Lanka with ease. Compare interest rates, check your eligibility, and find the perfect loan across 8 systematic banks.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <a
                                        href="#supported-banks"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-trust-blue hover:bg-opacity-90 md:py-4 md:text-lg md:px-10 transition-all font-semibold"
                                    >
                                        View Supported Banks
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 min-h-[450px] lg:h-full flex items-center justify-center bg-gradient-to-br from-trust-blue/5 to-trust-gold/5 p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-trust-gold opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-trust-gold flex items-center justify-center font-bold text-white text-xl">
                                    A
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-trust-blue leading-tight">Advisor Aruni</h3>
                                <span className="text-gray-400 text-xs flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                    Online • AI Loan Assistant
                                </span>
                            </div>
                        </div>
                        <h4 className="text-2xl font-bold text-trust-blue mb-4">Compare 8 Sri Lankan Banks Instantly!</h4>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            "Hello! I am Aruni. I can calculate your monthly instalments (EMI), check your eligibility, and help you find the lowest rates from BOC, People's Bank, Commercial Bank, and more."
                        </p>
                    </div>
                    <button
                        onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))}
                        className="w-full bg-trust-gold hover:bg-opacity-90 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-trust-gold/20 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Ask Aruni Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
