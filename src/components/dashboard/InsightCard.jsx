import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function InsightCard({ emotion, analysisCount, petName }) {
  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getInsightData = (emotion) => {
    const emotionLower = emotion?.toLowerCase() || "";
    
    if (emotionLower.includes("happy") || emotionLower.includes("playful")) {
      return {
        icon: Lightbulb,
        color: "from-green-500 to-emerald-500",
        bgColor: "bg-green-50",
        title: "Great News!",
        message: `${petName} is showing mostly ${capitalizeFirst(emotion)} behavior in recent analyses.`,
        tip: "Keep up the great work! Your pet is happy and well-adjusted."
      };
    }
    
    if (emotionLower.includes("anxious") || emotionLower.includes("stress")) {
      return {
        icon: AlertTriangle,
        color: "from-orange-500 to-red-500",
        bgColor: "bg-orange-50",
        title: "Attention Needed",
        message: `${petName} is showing ${capitalizeFirst(emotion)} signs in recent analyses.`,
        tip: "Consider consulting with a vet or behaviorist to address any concerns."
      };
    }
    
    if (emotionLower.includes("calm") || emotionLower.includes("relaxed")) {
      return {
        icon: TrendingUp,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-50",
        title: "Balanced Behavior",
        message: `${petName} is displaying ${capitalizeFirst(emotion)} demeanor consistently.`,
        tip: "Your pet seems well-balanced. Maintain current routines."
      };
    }
    
    return {
      icon: Lightbulb,
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-50",
      title: "Behavior Insight",
      message: `${petName} is showing ${capitalizeFirst(emotion)} behavior patterns.`,
      tip: "Continue monitoring to understand your pet's needs better."
    };
  };

  const insightData = getInsightData(emotion);
  const Icon = insightData.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className={`border-none shadow-xl ${insightData.bgColor} overflow-hidden`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${insightData.color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{insightData.title}</h3>
              <p className="text-gray-700 mb-2">{insightData.message}</p>
              <p className="text-sm text-gray-600 italic">{insightData.tip}</p>
              <p className="text-xs text-gray-500 mt-2">Based on {analysisCount} recent analyses</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}