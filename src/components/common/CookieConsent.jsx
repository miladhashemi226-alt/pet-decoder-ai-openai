import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cookie, X, Settings, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookie-consent');
    if (!consentGiven) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consentGiven);
        setPreferences(saved);
        applyConsent(saved);
      } catch (error) {
        console.error("Error loading cookie preferences:", error);
      }
    }
  }, []);

  const applyConsent = (prefs) => {
    // Apply cookie preferences
    if (!prefs.analytics) {
      // Disable analytics cookies
      // Example: disable Google Analytics
      window['ga-disable-UA-XXXXX-Y'] = true;
    }
    
    if (!prefs.marketing) {
      // Disable marketing cookies
      // Example: disable Facebook Pixel, etc.
    }
    
    if (!prefs.functional) {
      // Disable functional cookies (except necessary ones)
    }
  };

  const savePreferences = (prefs) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    applyConsent(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(onlyNecessary);
    savePreferences(onlyNecessary);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  return (
    <>
      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
          >
            <Card className="max-w-4xl mx-auto border-2 border-purple-200 shadow-2xl pointer-events-auto bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">🍪 We Value Your Privacy</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        GDPR Compliant
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                      We use cookies to enhance your experience, analyze site usage, and improve our services. 
                      You can choose which cookies to accept or reject all non-essential cookies. 
                      Your privacy is important to us.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={handleAcceptAll}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                      >
                        Accept All Cookies
                      </Button>
                      
                      <Button
                        onClick={handleRejectAll}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Reject All
                      </Button>
                      
                      <Button
                        onClick={() => setShowSettings(true)}
                        variant="outline"
                        className="border-purple-300 hover:bg-purple-50"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Customize
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      By clicking "Accept All", you agree to our use of cookies. 
                      Read our{" "}
                      <Link to={createPageUrl("PrivacyPolicy")} className="text-purple-600 hover:underline">
                        Privacy Policy
                      </Link>
                      {" "}and{" "}
                      <Link to={createPageUrl("TermsOfService")} className="text-purple-600 hover:underline">
                        Terms of Service
                      </Link>.
                    </p>
                  </div>

                  <button
                    onClick={handleRejectAll}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                    aria-label="Close and reject all cookies"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Settings className="w-6 h-6" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Choose which cookies you want to accept. You can change these settings at any time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-base font-semibold text-gray-900">
                    Necessary Cookies
                  </Label>
                  <Badge variant="outline" className="text-xs">Required</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  Essential for the website to function. These cookies enable core functionality such as security, 
                  authentication, and network management. Cannot be disabled.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Examples: Session cookies, security tokens, load balancing
                </p>
              </div>
              <Switch
                checked={true}
                disabled
                className="opacity-50"
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1 pr-4">
                <Label className="text-base font-semibold text-gray-900 mb-2 block">
                  Analytics Cookies
                </Label>
                <p className="text-sm text-gray-600">
                  Help us understand how visitors interact with our website by collecting and reporting 
                  information anonymously. Used to improve site performance and user experience.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Examples: Google Analytics, usage statistics, page views
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) => setPreferences({...preferences, analytics: checked})}
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1 pr-4">
                <Label className="text-base font-semibold text-gray-900 mb-2 block">
                  Marketing Cookies
                </Label>
                <p className="text-sm text-gray-600">
                  Track visitors across websites to display relevant advertisements. 
                  May be set by advertising partners to build a profile of your interests.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Examples: Facebook Pixel, retargeting ads, conversion tracking
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) => setPreferences({...preferences, marketing: checked})}
              />
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex-1 pr-4">
                <Label className="text-base font-semibold text-gray-900 mb-2 block">
                  Functional Cookies
                </Label>
                <p className="text-sm text-gray-600">
                  Enable enhanced functionality and personalization, such as language preferences, 
                  video preferences, and chat features.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Examples: Language settings, video player preferences, chat widgets
                </p>
              </div>
              <Switch
                checked={preferences.functional}
                onCheckedChange={(checked) => setPreferences({...preferences, functional: checked})}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleRejectAll}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
            >
              Reject All
            </Button>
            <Button
              onClick={handleSaveCustom}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Save Preferences
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Accept All
            </Button>
          </DialogFooter>

          <p className="text-xs text-gray-500 text-center mt-4">
            For more information, read our{" "}
            <Link to={createPageUrl("PrivacyPolicy")} className="text-purple-600 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}