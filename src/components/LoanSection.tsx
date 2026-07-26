import React from 'react';

interface BankCardProps {
    name: string;
    logo: string;
}

const BankCard: React.FC<BankCardProps> = ({ name, logo }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="h-20 rounded-xl bg-white border border-gray-100 flex items-center justify-center p-3 mb-5">
                <img
                    src={logo}
                    alt={`${name} logo`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                />
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
        { name: 'Bank of Ceylon (BOC)', logo: '/bank-logos/boc.png' },
        { name: "People's Bank", logo: '/bank-logos/peoples-bank.jpg' },
        { name: 'Commercial Bank PLC', logo: '/bank-logos/commercial-bank.jpeg' },
        { name: 'HNB Bank (Hatton National Bank)', logo: '/bank-logos/hnb.png' },
        { name: 'Sampath Bank', logo: '/bank-logos/sampath-bank.png' },
    ];

    return (
        <section id="data-sources" className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-trust-blue sm:text-4xl">Bank Data Sources</h2>
                    <div className="w-20 h-1.5 bg-trust-gold mx-auto mt-4 rounded-full"></div>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
                        The chatbot prototype uses personal-loan information from systemically important Sri Lankan banks as domain context for academic research testing.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {banks.map((bank) => (
                        <BankCard key={bank.name} name={bank.name} logo={bank.logo} />
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
