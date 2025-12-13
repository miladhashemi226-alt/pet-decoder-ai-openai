import React from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProgressIndicator({ steps, currentStep, progress }) {
  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">Processing...</span>
            <span className="text-purple-600 font-semibold">{progress}%</span>
          </div>
          
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            />
          </div>

          {steps && steps.length > 0 && (
            <div className="space-y-3 mt-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  {step.completed ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  ) : step.current ? (
                    <Loader2 className="w-6 h-6 text-purple-600 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={`text-sm ${
                    step.completed ? "text-green-600 font-medium" : 
                    step.current ? "text-purple-600 font-semibold" : 
                    "text-gray-500"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}