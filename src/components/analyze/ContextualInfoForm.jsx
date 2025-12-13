import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContextualInfoForm({ 
  contextualInfo, 
  setContextualInfo, 
  showContextForm, 
  setShowContextForm 
}) {
  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader 
        className="cursor-pointer hover:bg-purple-50 transition-colors"
        onClick={() => setShowContextForm(!showContextForm)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-600" />
            <span>Additional Context (Optional)</span>
          </div>
          {showContextForm ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </CardTitle>
        {!showContextForm && (
          <p className="text-sm text-gray-500">
            Help improve analysis accuracy by providing context
          </p>
        )}
      </CardHeader>

      <AnimatePresence>
        {showContextForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="whatHappened">
                  What happened before/during this video?
                </Label>
                <Textarea
                  id="whatHappened"
                  value={contextualInfo.whatHappened}
                  onChange={(e) => setContextualInfo(prev => ({
                    ...prev,
                    whatHappened: e.target.value
                  }))}
                  placeholder="e.g., doorbell rang, saw another dog, playing with toy..."
                  rows={2}
                  maxLength={300}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {contextualInfo.whatHappened.length}/300
                </p>
              </div>

              <div>
                <Label htmlFor="concernedAbout">
                  What are you concerned about?
                </Label>
                <Textarea
                  id="concernedAbout"
                  value={contextualInfo.concernedAbout}
                  onChange={(e) => setContextualInfo(prev => ({
                    ...prev,
                    concernedAbout: e.target.value
                  }))}
                  placeholder="e.g., seems anxious, unusual behavior, health concerns..."
                  rows={2}
                  maxLength={300}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {contextualInfo.concernedAbout.length}/300
                </p>
              </div>

              <div>
                <Label htmlFor="petReactivity">
                  How does your pet typically react to this situation?
                </Label>
                <Textarea
                  id="petReactivity"
                  value={contextualInfo.petReactivity}
                  onChange={(e) => setContextualInfo(prev => ({
                    ...prev,
                    petReactivity: e.target.value
                  }))}
                  placeholder="e.g., usually calm, normally excited, this is different..."
                  rows={2}
                  maxLength={300}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {contextualInfo.petReactivity.length}/300
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <Info className="w-4 h-4 inline mr-1" />
                  This information helps our AI provide more accurate and personalized analysis.
                </p>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}