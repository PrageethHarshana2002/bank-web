import React from 'react';

interface BankCardProps {
    name: string;
}

const BankCard: React.FC<BankCardProps> = ({ name }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-trust-gold/10 text-trust-gold flex items-center justify-center font-bold mb-5">
                {name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-trust-blue">{name}</h3>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Included as a Sri Lankan banking data source for the chatbot research prototype.
            </p>
        </div>
    );
};

const SupportedBanksSection: React.FC = () => {
    const banks = [
        'Bank of Ceylon (BOC)',
        "People's Bank",
        'Commercial Bank',
        'HNB',
        'Sampath Bank',
        'NSB',
        'DFCC Bank',
        'Seylan Bank'
    ];

    return (
        <section id="data-sources" className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-trust-blue sm:text-4xl">Bank Data Sources</h2>
                    <div className="w-20 h-1.5 bg-trust-gold mx-auto mt-4 rounded-full"></div>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
                        The chatbot prototype uses personal-loan information from selected Sri Lankan banks as domain context for academic research testing.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {banks.map((bank) => (
                        <BankCard key={bank} name={bank} />
                    ))}
                </div>
                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>* This section identifies the banking sources used for prototype context only. Participants should confirm official information directly with the relevant bank.</p>
                </div>
            </div>
        </section>
    );
};

export default SupportedBanksSection;
