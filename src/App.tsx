import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LoanSection from './components/LoanSection';
import ChatBubble from './components/Chat/ChatBubble';

const feedbackFormUrl = '#feedback';

const App: React.FC = () => {
  const howItWorks = [
    {
      title: 'Try Aruni',
      description: 'Open the chatbot and ask personal-loan questions as a digital banking customer would.'
    },
    {
      title: 'Experience the interaction',
      description: 'Observe the chatbot personality, empathy, human-like responses, and Sri Lankan banking guidance.'
    },
    {
      title: 'Share your feedback',
      description: 'Complete the research form so we can measure trust, digital literacy, and brand credibility perceptions.'
    }
  ];

  const researchFocus = [
    'Anthropomorphic AI-driven chatbot design',
    'Trust as a mediating factor',
    'Digital literacy as a moderating factor',
    'Brand credibility in Sri Lankan banking'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <div className="lg:col-span-2">
                <span className="text-sm font-bold uppercase tracking-wide text-trust-gold">Research Participation</span>
                <h2 className="mt-3 text-3xl font-bold text-trust-blue sm:text-4xl">Help us evaluate a human-like banking chatbot</h2>
                <p className="mt-5 text-lg text-gray-600 leading-relaxed">
                  Our research studies whether an anthropomorphic AI chatbot can improve customer trust and perceived brand credibility in the Sri Lankan banking sector. We invite you to interact with Aruni, our prototype personal-loan advisor, and then provide feedback through the research questionnaire.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))}
                    className="inline-flex justify-center rounded-lg bg-trust-blue px-6 py-3 font-semibold text-white shadow-md hover:bg-opacity-90 transition-all"
                  >
                    Use the Chatbot
                  </button>
                  <a
                    href="#feedback"
                    className="inline-flex justify-center rounded-lg border border-trust-blue px-6 py-3 font-semibold text-trust-blue hover:bg-gray-50 transition-all"
                  >
                    Open Feedback Section
                  </a>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-trust-blue text-lg">Study Focus</h3>
                <ul className="mt-4 space-y-3">
                  {researchFocus.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-gray-600">
                      <span className="mt-1 h-2 w-2 rounded-full bg-trust-gold flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-trust-blue text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm font-bold uppercase tracking-wide text-trust-gold">How It Works</span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">A simple three-step research flow</h2>
              <p className="mt-4 text-blue-100 text-lg">
                The chatbot interaction is used as the prototype experience. Your feedback helps us test the relationship between chatbot human-likeness, trust, digital literacy, and brand credibility.
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorks.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="text-trust-gold text-4xl font-bold mb-4">{index + 1}</div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-blue-100 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LoanSection />

        <section id="feedback" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 md:p-10 flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
              <div className="max-w-2xl">
                <span className="text-sm font-bold uppercase tracking-wide text-trust-gold">Research Feedback Form</span>
                <h2 className="mt-3 text-3xl font-bold text-trust-blue">Share your experience after using Aruni</h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  After chatting with Aruni, please complete the feedback form. Your responses will support quantitative analysis using SPSS and PLS-SEM/SEM.
                </p>
                <p className="mt-3 text-sm text-gray-500">
                  Replace this placeholder with your Google Form or survey link when it is ready.
                </p>
              </div>
              <a
                href={feedbackFormUrl}
                className="inline-flex justify-center rounded-lg bg-trust-gold px-8 py-4 font-bold text-white shadow-lg hover:bg-opacity-90 transition-all"
              >
                Open Feedback Form
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <span className="text-sm font-bold uppercase tracking-wide text-trust-gold">About the Research</span>
                <h2 className="mt-3 text-3xl font-bold text-trust-blue">Research brief</h2>
                <p className="mt-5 text-gray-600 leading-relaxed">
                  This study examines the impact of anthropomorphic AI-driven chatbots on brand credibility in the Sri Lankan banking sector. It tests trust as a mediator and digital literacy as a moderator, using a quantitative cross-sectional method with banking customers who interact with the prototype chatbot.
                </p>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  The expected contribution is an integrated model linking perceived human-likeness, warmth, competence, trust, digital literacy, and brand credibility within AI-enabled banking services.
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-trust-blue">Contact Details</h3>
                <div className="mt-5 space-y-4 text-gray-600">
                  <p><span className="font-semibold text-trust-blue">Researcher:</span> Add researcher name</p>
                  <p><span className="font-semibold text-trust-blue">Email:</span> add-email@example.com</p>
                  <p><span className="font-semibold text-trust-blue">Phone:</span> +94 XX XXX XXXX</p>
                  <p><span className="font-semibold text-trust-blue">Institution:</span> Add university or institute name</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-trust-blue text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-2xl font-bold tracking-tight">
              Aruni <span className="text-trust-gold">Research Prototype</span>
            </span>
            <p className="mt-2 text-blue-200 text-sm">Academic study on AI chatbot anthropomorphism, trust, digital literacy, and bank brand credibility.</p>
          </div>
          <div className="flex space-x-8 text-sm text-blue-100">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#data-sources" className="hover:text-white transition-colors">Data Sources</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-white/10 text-center text-blue-300 text-xs">
          2026 AI Chatbot Banking Research Project. All rights reserved.
        </div>
      </footer>
      <ChatBubble />
    </div>
  );
};

export default App;
