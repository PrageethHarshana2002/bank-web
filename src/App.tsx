import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LoanSection from './components/LoanSection';
import ChatBubble from './components/Chat/ChatBubble';

const App: React.FC = () => {
  return (
    <div className="min-height-screen bg-white">
      <Header />
      <main>
        <Hero />
        <LoanSection />

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-trust-blue mb-8">Why TrustBank?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-trust-gold text-4xl font-bold mb-2">99%</div>
                <div className="text-gray-600 font-medium">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-trust-gold text-4xl font-bold mb-2">AI-Driven</div>
                <div className="text-gray-600 font-medium">Ethical Lending</div>
              </div>
              <div>
                <div className="text-trust-gold text-4xl font-bold mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Expert Support</div>
              </div>
              <div>
                <div className="text-trust-gold text-4xl font-bold mb-2">Secure</div>
                <div className="text-gray-600 font-medium">Blockchain Verification</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-trust-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <span className="text-2xl font-bold tracking-tight">
              Trust<span className="text-trust-gold">Bank</span>
            </span>
            <p className="mt-2 text-blue-200 text-sm">Empowering financial futures through AI and ethics.</p>
          </div>
          <div className="flex space-x-8 text-sm text-blue-100">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-white/10 text-center text-blue-300 text-xs">
          © 2026 TrustBank AI Research Project. All rights reserved.
        </div>
      </footer>

      <ChatBubble />
    </div>
  );
};

export default App;

