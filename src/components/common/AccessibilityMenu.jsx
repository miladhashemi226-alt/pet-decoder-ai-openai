import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Type, Contrast, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false
  });

  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applySettings(parsed);
    }

    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const newSettings = { ...settings, reducedMotion: true };
      setSettings(newSettings);
      applySettings(newSettings);
    }
  }, []);

  const applySettings = (newSettings) => {
    const root = document.documentElement;
    
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (newSettings.largeText) {
      root.style.fontSize = '118%';
    } else {
      root.style.fontSize = '';
    }
    
    if (newSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
    } else {
      root.style.setProperty('--animation-duration', '');
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-white hover:bg-purple-50 border-2 border-purple-300"
        aria-label={isOpen ? "Close accessibility settings" : "Open accessibility settings"}
        aria-expanded={isOpen}
      >
        <Eye className="w-6 h-6 text-purple-600" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 right-6 z-50 w-80"
              role="dialog"
              aria-label="Accessibility settings"
              aria-modal="true"
            >
              <Card className="border-2 border-purple-300 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Eye className="w-5 h-5" aria-hidden="true" />
                      Accessibility Settings
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-purple-100 rounded-full"
                      aria-label="Close settings"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Contrast className="w-4 h-4 text-gray-600" aria-hidden="true" />
                        <Label htmlFor="high-contrast">High Contrast</Label>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={settings.highContrast}
                        onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                        aria-describedby="high-contrast-description"
                      />
                    </div>
                    <p id="high-contrast-description" className="text-xs text-gray-500 ml-6">
                      Increases contrast for better visibility
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-gray-600" aria-hidden="true" />
                        <Label htmlFor="large-text">Larger Text</Label>
                      </div>
                      <Switch
                        id="large-text"
                        checked={settings.largeText}
                        onCheckedChange={(checked) => updateSetting('largeText', checked)}
                        aria-describedby="large-text-description"
                      />
                    </div>
                    <p id="large-text-description" className="text-xs text-gray-500 ml-6">
                      Makes text 18% larger across the app
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-gray-600" aria-hidden="true" />
                        <Label htmlFor="reduced-motion">Reduce Motion</Label>
                      </div>
                      <Switch
                        id="reduced-motion"
                        checked={settings.reducedMotion}
                        onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                        aria-describedby="reduced-motion-description"
                      />
                    </div>
                    <p id="reduced-motion-description" className="text-xs text-gray-500 ml-6">
                      Minimizes animations and transitions
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
                    These settings are saved locally and will persist across sessions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}