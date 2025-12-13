
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import { 
  PawPrint, 
  Brain, 
  Upload, 
  TrendingUp, 
  Heart,
  ArrowRight,
  Check,
  AlertTriangle,
  Shield,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: PawPrint,
      title: "Welcome to Pet Decoder AI",
      description: "Your intelligent companion for understanding your pet's emotions and behavior.",
      features: [
        "AI-powered behavioral analysis from photos & videos",
        "Real-time emotion detection and insights",
        "Personalized recommendations from pet experts",
        "Track your pet's wellbeing over time"
      ]
    },
    {
      icon: Upload,
      title: "How It Works - Simple 3-Step Process",
      description: "Get professional insights in under 60 seconds.",
      features: [
        "📸 Upload a clear photo or video (max 2 minutes)",
        "🤖 Our AI analyzes body language, expressions, and context",
        "💡 Get instant insights with confidence scores and expert recommendations",
        "📊 Build a history to track behavioral patterns over time"
      ]
    },
    {
      icon: Target,
      title: "Best Results - Tips for Success",
      description: "Get the most accurate analysis with these guidelines:",
      features: [
        "Use good lighting - natural light works best",
        "Keep your pet clearly visible and in focus",
        "Capture natural behaviors, not posed photos",
        "For videos: 10-120 seconds captures enough context", // Changed from 10-60 to 10-120
        "Try different angles and activities for variety"
      ]
    },
    {
      icon: Brain,
      title: "What We Analyze",
      description: "Our AI evaluates multiple behavioral indicators:",
      features: [
        "😊 Emotions: happy, anxious, playful, stressed, relaxed, curious",
        "🐾 Body language: posture, tail position, ear placement",
        "📈 Behavioral patterns and changes over time",
        "🎯 Breed-specific benchmarks and comparisons"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Important Disclaimers",
      description: "Please read carefully before proceeding:",
      features: [
        "⚠️ NOT a substitute for professional veterinary advice",
        "🤖 AI analysis may contain errors or inaccuracies",
        "📊 Confidence scores indicate reliability, not guarantees",
        "🏥 Always consult a licensed veterinarian for health concerns",
        "📚 Results are educational and informational only"
      ],
      warning: true
    },
    {
      icon: Shield,
      title: "Your Privacy Matters",
      description: "We take data protection seriously.",
      features: [
        "🔒 Bank-level encryption (AES-256) for all data",
        "✅ GDPR, CCPA & PIPEDA compliant",
        "🚫 Your photos are NEVER used for AI training",
        "🗑️ Delete your data anytime - gone in 30 days",
        "🌍 Full transparency in our Privacy Policy"
      ]
    }
  ];

  const handleFinish = async () => {
    try {
      const user = await User.me();
      await User.updateMyUserData({ onboarding_completed: true });
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error completing onboarding:", error);
      navigate(createPageUrl("Dashboard"));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    if (window.confirm("Are you sure you want to skip the intro? We recommend reviewing the important disclaimers and tips for best results.")) {
      handleFinish();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`border-none shadow-2xl bg-white/95 backdrop-blur-sm ${step.warning ? 'ring-4 ring-amber-400' : ''}`}>
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className={`w-20 h-20 ${step.warning ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {step.title}
                  </h1>
                  <p className="text-xl text-gray-600">
                    {step.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {step.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start gap-3 p-4 ${step.warning ? 'bg-amber-50 border-2 border-amber-200' : 'bg-purple-50'} rounded-xl`}
                    >
                      <div className={`w-6 h-6 ${step.warning ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        {step.warning ? (
                          <AlertTriangle className="w-4 h-4 text-white" />
                        ) : (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <p className={`${step.warning ? 'text-amber-900' : 'text-gray-700'} text-lg`}>{feature}</p>
                    </motion.div>
                  ))}
                </div>

                {step.warning && (
                  <div className="mb-8 p-4 bg-red-50 border-2 border-red-300 rounded-xl">
                    <p className="text-red-900 font-semibold text-center">
                      By continuing, you acknowledge that you have read and understood these limitations.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    {steps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentStep 
                            ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500' 
                            : index < currentStep
                            ? 'w-2 bg-green-500'
                            : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {currentStep + 1} of {steps.length}
                  </p>
                </div>

                <div className="flex gap-4">
                  {currentStep > 0 && (
                    <Button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      variant="outline"
                      className="flex-1 border-purple-300 hover:bg-purple-50"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleSkip}
                    variant="outline"
                    className="flex-1 border-purple-300 hover:bg-purple-50"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    {currentStep < steps.length - 1 ? (
                      <>
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
