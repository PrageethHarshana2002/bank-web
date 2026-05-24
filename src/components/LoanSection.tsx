import React from 'react';

interface BankCardProps {
    name: string;
    rate: string;
    maxAmount: string;
    maxTenure: string;
    features: string;
}

const BankCard: React.FC<BankCardProps> = ({ name, rate, maxAmount, maxTenure, features }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-trust-blue mb-4">{name}</h3>
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Rate (p.a.)</span>
                    <span className="font-semibold text-gray-800 text-right">{rate}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Max Amount</span>
                    <span className="font-semibold text-gray-800 text-right">{maxAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Max Tenure</span>
                    <span className="font-semibold text-gray-800 text-right">{maxTenure}</span>
                </div>
            </div>
            <div className="pt-2">
                <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-semibold text-trust-gold block mb-1">Key Features:</span>
                    {features}
                </p>
            </div>
        </div>
    );
};

const SupportedBanksSection: React.FC = () => {
    const banks = [
        {
            name: 'Bank of Ceylon (BOC)',
            rate: '~11-14%',
            maxAmount: 'LKR 10 million',
            maxTenure: '7 years',
            features: 'Govt. employee preferential rates; 1-2 guarantors'
        },
        {
            name: "People's Bank",
            rate: '~11-14%',
            maxAmount: 'LKR 15 million',
            maxTenure: '10 years',
            features: 'Longest tenure; salary assignment required; best for govt sector'
        },
        {
            name: 'Commercial Bank',
            rate: '~13-16%',
            maxAmount: 'LKR 10 million',
            maxTenure: '5 years',
            features: 'Fast digital approval; no guarantor required'
        },
        {
            name: 'HNB',
            rate: '~13-16%',
            maxAmount: 'LKR 10 million',
            maxTenure: '5 years',
            features: 'HNB Solo app; insurance-linked products'
        },
        {
            name: 'Sampath Bank',
            rate: '~13.5-20%',
            maxAmount: 'LKR 10 million',
            maxTenure: '7 years',
            features: 'No collateral; 1% processing fee; fully unsecured'
        },
        {
            name: 'NSB',
            rate: '~11-12.5%',
            maxAmount: 'LKR 5 million',
            maxTenure: '7 years',
            features: 'Lowest rates overall; fee waived for salary account holders'
        },
        {
            name: 'DFCC Bank',
            rate: '~14-17%',
            maxAmount: 'LKR 10 million',
            maxTenure: '5 years',
            features: 'Strong digital platform; fast processing'
        },
        {
            name: 'Seylan Bank',
            rate: '~11.5-17.5%',
            maxAmount: 'LKR 10 million',
            maxTenure: '7 years',
            features: 'Wide rate range by credit profile; mandatory credit life insurance'
        }
    ];

    return (
        <section id="supported-banks" className="py-24 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-trust-blue sm:text-4xl">Supported Banks</h2>
                    <div className="w-20 h-1.5 bg-trust-gold mx-auto mt-4 rounded-full"></div>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
                        Aruni can compare rates and conditions across the 8 major systematic banks in Sri Lanka to help you find the best personal loan.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {banks.map((bank, index) => (
                        <BankCard key={index} {...bank} />
                    ))}
                </div>
                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>* Rates are indicative as of 2025. Please ask Aruni for the latest details or confirm with the bank.</p>
                </div>
            </div>
        </section>
    );
};

export default SupportedBanksSection;
