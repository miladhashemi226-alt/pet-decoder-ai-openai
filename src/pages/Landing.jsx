import React from "react";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";

// Minimal inline components to avoid importing heavy UI library
const MinimalButton = ({ onClick, children, variant = "primary", size = "md" }) => {
  const baseStyles = "font-bold rounded-2xl transition-all duration-200 inline-flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-white text-purple-600 hover:bg-gray-100 shadow-lg",
    secondary: "border-2 border-white/30 bg-white/10 text-white hover:bg-white/20"
  };
  const sizes = {
    md: "px-8 py-4 text-lg",
    lg: "px-14 py-8 text-xl"
  };
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
};

const MinimalBadge = ({ children, color = "white" }) => {
  const colors = {
    white: "bg-white/20 backdrop-blur-sm text-white border border-white/30",
    green: "bg-green-500 text-white border-none"
  };
  
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

export default function Landing() {
  const handleGetStarted = async () => {
    try {
      const currentUrl = window.location.origin + createPageUrl("Onboarding");
      await User.loginWithRedirect(currentUrl);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleTryNow = () => {
    window.location.href = createPageUrl("Analyze");
  };

  return (
    <>
      {/* SEO Meta Tags - Inline to avoid component overhead */}
      <title>Pet Decoder AI - Free AI Pet Behavior Analysis</title>
      <meta name="description" content="Upload photos or videos of your pet and get instant AI-powered insights into their emotions and body language. Completely free." />
      <meta name="keywords" content="pet behavior analysis, AI pet decoder, dog behavior, cat behavior" />
      <meta property="og:title" content="Pet Decoder AI - Free AI Pet Behavior Analysis" />
      <meta property="og:description" content="Upload photos or videos of your pet and get instant AI-powered insights into their emotions and body language. Completely free." />
      <meta property="og:type" content="website" />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Minimal Navigation */}
        <nav className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🐾</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Pet Decoder AI
                </span>
              </div>
              <MinimalButton onClick={handleTryNow} variant="primary" size="md">
                Try Free →
              </MinimalButton>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-600">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                <MinimalBadge color="white">
                  🛡️ GDPR Compliant
                </MinimalBadge>
                <MinimalBadge color="green">
                  🎁 100% Free
                </MinimalBadge>
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
                Understand Your Pet's
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Body Language
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto">
                Upload a photo or video and get <strong>instant AI analysis</strong> of your pet's emotions and behavior. <strong className="text-yellow-300">Completely free.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <MinimalButton onClick={handleTryNow} variant="primary" size="lg">
                  💡 Try Now - No Signup →
                </MinimalButton>
                <MinimalButton onClick={handleGetStarted} variant="secondary" size="lg">
                  👥 Sign Up Free
                </MinimalButton>
              </div>

              <div className="flex items-center justify-center gap-4 md:gap-6 text-white/90 text-sm md:text-base flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>No signup to try</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Results in 60s</span>
                </div>
              </div>
            </div>

            {/* 3-Step Process */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  📤
                </div>
                <h3 className="text-xl font-bold mb-2">1. Upload</h3>
                <p className="text-gray-600">Photo or video of your pet</p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🧠
                </div>
                <h3 className="text-xl font-bold mb-2">2. AI Analyzes</h3>
                <p className="text-gray-600">Advanced computer vision</p>
              </div>

              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  💚
                </div>
                <h3 className="text-xl font-bold mb-2">3. Get Insights</h3>
                <p className="text-gray-600">Detailed behavior analysis</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">Why Pet Decoder AI?</h2>
              <p className="text-xl text-gray-600">Everything you need, completely free</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Instant Analysis</h3>
                <p className="text-gray-600">Get results in under 60 seconds</p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">100% Private</h3>
                <p className="text-gray-600">Never used to train AI models</p>
              </div>

              <div className="text-center">
                <div className="text-5xl mb-4">💚</div>
                <h3 className="text-xl font-bold mb-2">Always Free</h3>
                <p className="text-gray-600">No hidden costs, ever</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center text-white max-w-4xl">
            <MinimalBadge color="white">
              🎁 100% Free Forever
            </MinimalBadge>
            <h2 className="text-4xl md:text-5xl font-black mb-6 mt-6">
              Ready to Understand Your Pet?
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-95">
              Join thousands of pet parents using AI to decode behavior
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MinimalButton onClick={handleTryNow} variant="primary" size="lg">
                💡 Try Now - No Signup →
              </MinimalButton>
              <MinimalButton onClick={handleGetStarted} variant="secondary" size="lg">
                Sign Up Free
              </MinimalButton>
            </div>
            <p className="text-base mt-6 opacity-80">No credit card • Try immediately • All features free</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-purple-100 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">🐾</span>
              </div>
              <span className="font-bold text-lg">Pet Decoder AI</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              AI-powered pet behavior analysis
            </p>
            <div className="flex items-center justify-center gap-6 text-sm mb-4">
              <a href={createPageUrl("PrivacyPolicy")} className="text-gray-600 hover:text-purple-600">
                Privacy
              </a>
              <a href={createPageUrl("TermsOfService")} className="text-gray-600 hover:text-purple-600">
                Terms
              </a>
              <a href={createPageUrl("Contact")} className="text-gray-600 hover:text-purple-600">
                Contact
              </a>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Pet Decoder AI • GDPR Compliant • 100% Free
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}