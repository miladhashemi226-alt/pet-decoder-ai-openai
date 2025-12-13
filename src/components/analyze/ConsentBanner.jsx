import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsentBanner({ onAccept }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-2 border-blue-200 bg-blue-50/50 backdrop-blur-sm shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Privacy & Consent Notice
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By uploading media, you consent to AI processing of your pet's images/videos for behavioral analysis. 
                We comply with <strong>GDPR, CCPA, and PIPEDA</strong>. Your data is encrypted, never sold, and you can delete it anytime.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mb-6">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Your pet's media is processed securely and encrypted</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>We never sell or share your personal data</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>You can delete your data at any time from Settings</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Full transparency in how we use AI for analysis</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onAccept}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-lg"
            >
              I Understand & Accept
            </Button>
          </div>

          <p className="text-xs text-gray-600 mt-4 text-center">
            By continuing, you agree to our{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>,{" "}
            <a href="/terms-of-service" className="text-blue-600 hover:underline">Terms of Service</a>, and{" "}
            <a href="/ai-transparency" className="text-blue-600 hover:underline">AI Transparency</a>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}