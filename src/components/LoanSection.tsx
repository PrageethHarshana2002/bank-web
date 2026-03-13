import React from 'react';

interface LoanCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const LoanCard: React.FC<LoanCardProps> = ({ title, description, icon }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-trust-blue mb-6 group-hover:bg-trust-blue group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-trust-blue mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
                {description}
            </p>
            <a href="#" className="inline-flex items-center text-trust-gold font-semibold hover:text-trust-blue transition-colors">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </a>
        </div>
    );
};

const LoanSection: React.FC = () => {
    const loans = [
        {
            title: 'Housing Loans',
            description: 'Flexible mortgage solutions with AI-powered rate optimization to help you secure your dream home with ease.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            title: 'Personal Loans',
            description: 'Quick approval personal loans for your immediate needs, featuring transparent terms and ethical interest calculations.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            title: 'SME Loans',
            description: 'Empowering small and medium enterprises with scalable financial support designed to fuel business growth.',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            )
        }
    ];

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-trust-blue sm:text-4xl">Our Loan Products</h2>
                    <div className="w-20 h-1.5 bg-trust-gold mx-auto mt-4 rounded-full"></div>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
                        Discover a range of financial products tailored to your unique requirements, backed by our commitment to ethical lending.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {loans.map((loan, index) => (
                        <LoanCard key={index} {...loan} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LoanSection;
