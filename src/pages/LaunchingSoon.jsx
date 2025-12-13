
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Mail, CheckCircle, Rocket, Clock, Bell } from "lucide-react";
import { motion } from "framer-motion";
import AppLogo from "../components/common/AppLogo";
import SEO from "../components/common/SEO";

export default function LaunchingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set launch date (5 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 5);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend/email service
      console.log("Email submitted:", email);
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <>
      <SEO
        title="Pet Decoder AI - Launching Soon | AI-Powered Pet Behavior Analysis"
        description="Pet Decoder AI is launching soon! Be the first to decode your pet's emotions with advanced AI. Sign up for early access and exclusive launch updates."
        keywords="pet decoder AI, coming soon, pet behavior analysis, AI pet analyzer, pet emotions, launching soon"
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-[10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-[30%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl w-full text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <AppLogo size="xl" className="mx-auto mb-6 shadow-2xl" />
            </motion.div>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Badge className="mb-6 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border-white/30 text-base">
                <Sparkles className="w-4 h-4 mr-2" />
                Powered by Advanced AI
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Pet Decoder AI
              <span className="block mt-2 text-3xl md:text-5xl text-purple-200">
                Launching Soon
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto"
            >
              The revolutionary AI-powered platform to decode your pet's emotions, 
              understand their behavior, and build a deeper bond with your furry friend.
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <Card className="border-none shadow-2xl bg-white/10 backdrop-blur-xl mx-auto max-w-3xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center gap-2 mb-6 text-white">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg font-semibold">Launching In:</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 md:gap-8">
                    {[
                      { value: timeLeft.days, label: "Days" },
                      { value: timeLeft.hours, label: "Hours" },
                      { value: timeLeft.minutes, label: "Minutes" },
                      { value: timeLeft.seconds, label: "Seconds" }
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="text-4xl md:text-6xl font-bold text-white mb-2">
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-sm md:text-base text-purple-200 uppercase tracking-wider">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Email Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-md mx-auto mb-12"
            >
              {!submitted ? (
                <Card className="border-none shadow-2xl bg-white/95 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-gray-700">
                      <Bell className="w-5 h-5" />
                      <h3 className="text-lg font-bold">Get Early Access</h3>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">
                      Be the first to know when we launch. Get exclusive early access and special launch offers!
                    </p>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1 border-purple-200 focus:border-purple-400"
                      />
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Notify Me
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Card className="border-none shadow-2xl bg-green-500/90 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">You're on the list!</h3>
                      <p className="text-green-100">
                        We'll notify you as soon as we launch. Thank you for your interest!
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {[
                {
                  icon: "🧠",
                  title: "AI-Powered Analysis",
                  description: "Advanced computer vision decodes your pet's emotions and body language"
                },
                {
                  icon: "📊",
                  title: "Behavior Tracking",
                  description: "Monitor trends and patterns in your pet's emotional wellbeing"
                },
                {
                  icon: "💡",
                  title: "Expert Insights",
                  description: "Get professional recommendations and actionable advice"
                }
              ].map((feature, index) => (
                <Card key={index} className="border-none shadow-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-purple-100 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-16 text-white/70 text-sm"
            >
              <p>© 2025 Pet Decoder AI. All rights reserved.</p>
              <p className="mt-2">GDPR, CCPA & PIPEDA Compliant • Privacy-First Design</p>
            </motion.div>
          </motion.div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </>
  );
}
