import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2, Lightbulb, AlertCircle, RotateCcw, ThumbsUp, ThumbsDown, MessageSquare, Send, AlertTriangle, Info,
  X, Sparkles, Crown, FileText, Brain, Target, CheckCircle, Redo, History, Smile, Frown, Annoyed, Zap, Cat, Dog, PawPrint, Search, Megaphone, Meh, Lock, TrendingUp, ArrowRight, MessageCircle, Volume2, LogIn
} from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/api/entities";

export default function AnalysisResults({ result, onReset, user, isAuthenticated }) {
  // Helper function to capitalize the first letter of a string and make the rest lowercase
  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getEmotionIcon = (emotion) => {
    const emotionLower = emotion?.toLowerCase() || "";

    // Positive emotions
    if (emotionLower.includes("happy")) return "😊";
    if (emotionLower.includes("playful")) return "🤪";
    if (emotionLower.includes("excited")) return "🤩";
    if (emotionLower.includes("affectionate")) return "🥰";
    if (emotionLower.includes("content")) return "😌";
    if (emotionLower.includes("relaxed")) return "😊";
    if (emotionLower.includes("calm")) return "😌";

    // Neutral/Observant
    if (emotionLower.includes("sleepy") || emotionLower.includes("tired")) return "😴";
    if (emotionLower.includes("neutral")) return "😐";
    if (emotionLower.includes("alert")) return "👀";
    if (emotionLower.includes("curious") || emotionLower.includes("interested")) return "🤔";

    // Negative emotions
    if (emotionLower.includes("anxious")) return "😰";
    if (emotionLower.includes("stressed")) return "😓";
    if (emotionLower.includes("fearful") || emotionLower.includes("scared")) return "😨";
    if (emotionLower.includes("aggressive") || emotionLower.includes("angry")) return "😠";
    if (emotionLower.includes("frustrated")) return "😤";
    if (emotionLower.includes("bored")) return "😑";
    if (emotionLower.includes("confused")) return "😕";
    if (emotionLower.includes("uncomfortable")) return "😣";
    if (emotionLower.includes("distressed")) return "😰";
    if (emotionLower.includes("defensive")) return "🛡️";
    if (emotionLower.includes("submissive")) return "😌";
    if (emotionLower.includes("pain")) return "😖";
    if (emotionLower.includes("nervous")) return "😬";
    if (emotionLower.includes("withdrawn")) return "😞";
    if (emotionLower.includes("jealous")) return "😒";

    // Behavioral states
    if (emotionLower.includes("territorial")) return "🚩";
    if (emotionLower.includes("hunting")) return "🎯";
    if (emotionLower.includes("protective")) return "🛡️";
    if (emotionLower.includes("confident")) return "😎";
    if (emotionLower.includes("suspicious")) return "🧐";
    if (emotionLower.includes("restless")) return "😣";
    if (emotionLower.includes("overstimulated")) return "🤯";

    return "😐";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* Main Emotion Card */}
      <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">{getEmotionIcon(result?.emotion_detected)}</div>
            <h2 className="text-4xl font-bold mb-2">{capitalizeFirst(result?.emotion_detected)}</h2>
            {result?.pet && (
              <p className="text-white/90 text-lg">
                Detected in {result.pet.name}
                {result.pet.gender ? ` (${capitalizeFirst(result.pet.gender)})` : ''}
              </p>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center justify-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <div>
                <p className="text-sm text-white/80">Confidence Level</p>
                <p className="text-3xl font-bold">{result?.confidence_level}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sign up prompt for unauthenticated users */}
      {!isAuthenticated && (
        <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              Love these insights? Sign in to save them!
            </h3>
            <p className="text-gray-600 mb-6">
              Create an account to track your pet's behavior over time, get personalized recommendations, and access all features.
            </p>
            <Button
              onClick={() => {
                const currentUrl = window.location.href;
                User.loginWithRedirect(currentUrl);
              }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 text-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In with Google
            </Button>
            <p className="text-sm text-gray-500 mt-6">
              Free • No credit card required • Sign up in 10 seconds
            </p>
          </CardContent>
        </Card>
      )}

      {/* Behavior Summary */}
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Behavior Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed text-lg">
            {result?.behavior_summary}
          </p>
        </CardContent>
      </Card>

      {/* Detailed Analysis - Always visible if data exists */}
      {result?.detailed_analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-500" />
                Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result?.detailed_analysis}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Audio Guidance - Always visible if data exists */}
      {result?.audio_analyzed && result?.audio_summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6"
        >
          <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader className="border-b border-indigo-100">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-indigo-600" />
                Audio Guidance: What to Listen For
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Alert className="mb-4 border-indigo-200 bg-indigo-50">
                <AlertDescription className="text-indigo-900">
                  <strong className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Expert Audio Guidance
                  </strong>
                  <p className="mt-1 text-sm">{result.audio_summary}</p>
                </AlertDescription>
              </Alert>
              {result.audio_insights && result.audio_insights !== "No audio insights available." && (
                <div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {result.audio_insights}
                  </p>
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertDescription className="text-blue-900 text-sm">
                      <strong>💡 How to Use:</strong> Play your video and listen for these vocalizations. This guidance helps you understand what different sounds mean based on the behavior AI observed.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Possible Reasons */}
      {result?.possible_reasons && result.possible_reasons.length > 0 && (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="w-6 h-6 text-orange-500" />
              Possible Reasons
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {result.possible_reasons.map((reason, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 leading-relaxed">{reason}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {result?.recommendations && result.recommendations.length > 0 && (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-6 h-6 text-green-500" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 leading-relaxed">{rec}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          onClick={onReset}
          size="lg"
          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6"
        >
          <Redo className="w-5 h-5 mr-2" />
          Analyze Another
        </Button>
        {isAuthenticated && (
          <Link to={createPageUrl("History")} className="flex-1">
            <Button variant="outline" size="lg" className="w-full py-6 border-purple-200 hover:bg-purple-50">
              <History className="w-5 h-5 mr-2" />
              View History
            </Button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}