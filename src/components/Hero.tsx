import React from 'react';

const Hero: React.FC = () => {
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-trust-blue sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">The Future of</span>{' '}
                                <span className="block text-trust-gold xl:inline font-serif italic">Ethical Lending</span>
                            </h1>
                            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                Empowering your dreams with transparent, AI-driven lending solutions. At TrustBank, we prioritize ethical practices and financial inclusivity for a brighter tomorrow.
                            </p>
                            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <a
                                        href="#"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-trust-blue hover:bg-opacity-90 md:py-4 md:text-lg md:px-10 transition-all"
                                    >
                                        Learn More
                                    </a>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">
                                    <a
                                        href="#"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-trust-blue bg-blue-50 hover:bg-blue-100 md:py-4 md:text-lg md:px-10 transition-all"
                                    >
                                        View Rates
                                    </a>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <div className="h-56 w-full bg-trust-blue bg-opacity-5 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
                    {/* Abstract visual placeholder for banking/AI theme */}
                    <div className="w-64 h-64 border-4 border-trust-gold border-opacity-20 rounded-full animate-pulse flex items-center justify-center">
                        <div className="w-48 h-48 border-4 border-trust-blue border-opacity-20 rounded-full flex items-center justify-center">
                            <div className="w-32 h-32 bg-trust-blue bg-opacity-10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
