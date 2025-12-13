
import React, { useState, useEffect } from "react";
import { Analysis } from "@/api/entities";
import { Pet } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, TrendingUp, AlertCircle, Lock, Crown, Lightbulb, CheckCircle, Brain, Target, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { formatLocalDateTime } from "@/components/utils/dateFormatter";
import SEO from "../components/common/SEO";

export default function AnalysisDetail() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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
    if (emotionLower.includes("aggressive")) return "😠";
    if (emotionLower.includes("frustrated")) return "😤";
    if (emotionLower.includes("bored")) return "😑";
    if (emotionLower.includes("confused")) return "😕";
    if (emotionLower.includes("uncomfortable")) return "😣";
    if (emotionLower.includes("distressed")) return "😰";
    if (emotionLower.includes("defensive")) return "🛡️";
    if (emotionLower.includes("submissive")) return "😌"; // Changed from 😢 or 😔 to reflect a more neutral submissive posture
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

  const loadAnalysis = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const urlParams = new URLSearchParams(window.location.search);
      const analysisId = urlParams.get('id');

      if (!analysisId) {
        setError("No analysis ID provided");
        setIsLoading(false); // Corrected from setIsLoadingUser to setIsLoading
        return;
      }

      const analyses = await Analysis.list();
      const foundAnalysis = analyses.find(a => a.id === analysisId);

      if (!foundAnalysis) {
        setError("Analysis not found");
        setIsLoading(false); // Corrected from setIsLoadingUser to setIsLoading
        return;
      }

      // Fix confidence level if it's in 0-1 scale
      if (foundAnalysis.confidence_level > 0 && foundAnalysis.confidence_level < 1) {
        foundAnalysis.confidence_level = Math.round(foundAnalysis.confidence_level * 100);
      } else {
        foundAnalysis.confidence_level = Math.round(foundAnalysis.confidence_level);
      }

      setAnalysis(foundAnalysis);

      if (foundAnalysis.pet_id) {
        const pets = await Pet.list();
        const foundPet = pets.find(p => p.id === foundAnalysis.pet_id);
        setPet(foundPet);
      }

    } catch (error) {
      console.error("Error loading analysis:", error);
      setError("Failed to load analysis details");
    } finally {
      setIsLoading(false); // Corrected from setIsLoadingUser to setIsLoading
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <>
        <SEO
          title="Analysis Not Found - Pet Decoder AI"
          description="The requested analysis could not be found."
          noIndex={true}
        />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm max-w-md w-full">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                {error || "Analysis Not Found"}
              </h2>
              <p className="text-gray-600 mb-8">
                The analysis you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link to={createPageUrl("History")}>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`Analysis: ${capitalizeFirst(analysis.emotion_detected)} - Pet Decoder AI`}
        description={`Detailed behavior analysis for ${pet?.name || 'your pet'} showing ${analysis.emotion_detected} emotion.`}
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("History"))}
              className="hover:bg-purple-100 border-purple-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Analysis Details
              </h1>
              <p className="text-gray-600 mt-1">
                {formatLocalDateTime(analysis.created_date)}
              </p>
            </div>
          </motion.div>

          {/* Pet Info Card */}
          {pet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {pet.photo_url && (
                      <img
                        src={pet.photo_url}
                        alt={pet.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p className="text-gray-600">
                        {capitalizeFirst(pet.species)}
                        {pet.breed ? ` • ${pet.breed}` : ''}
                        {pet.gender ? ` • ${capitalizeFirst(pet.gender)}` : ''}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Main Emotion Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4">{getEmotionIcon(analysis.emotion_detected)}</div>
                  <h2 className="text-4xl font-bold mb-2">{capitalizeFirst(analysis.emotion_detected)}</h2>
                  <p className="text-white/90 text-lg">Primary Emotion Detected</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center justify-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    <div>
                      <p className="text-sm text-white/80">Confidence Level</p>
                      <p className="text-3xl font-bold">{analysis.confidence_level}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Behavior Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Behavior Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {analysis.behavior_summary}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Detailed Analysis - Always visible if data exists */}
          {analysis.detailed_analysis && (
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
                    {analysis.detailed_analysis}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Audio Guidance - Always visible if data exists */}
          {analysis.audio_analyzed && analysis.audio_summary && (
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
                      <p className="mt-1 text-sm font-semibold">{analysis.audio_summary}</p>
                    </AlertDescription>
                  </Alert>
                  {analysis.audio_insights && analysis.audio_insights !== "No audio insights available." && (
                    <div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                        {analysis.audio_insights}
                      </p>
                      <Alert className="border-blue-200 bg-blue-50">
                        <AlertDescription className="text-blue-900 text-sm">
                          <strong>💡 How to Use:</strong> Play your video and listen for the vocalizations described above.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Possible Reasons - Always visible if data exists */}
          {analysis.possible_reasons && analysis.possible_reasons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-orange-500" />
                    Possible Reasons
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {analysis.possible_reasons.map((reason, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
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
            </motion.div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-green-500" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 leading-relaxed">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Media */}
          {analysis.video_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-6"
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle>Original Media</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {analysis.video_url.includes('.mp4') || analysis.video_url.includes('.mov') || analysis.video_url.includes('.webm') ? (
                    <video
                      src={analysis.video_url}
                      controls
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <img
                      src={analysis.video_url}
                      alt="Analysis media"
                      className="w-full rounded-lg"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to={createPageUrl("History")} className="flex-1">
              <Button variant="outline" size="lg" className="w-full py-6 border-purple-200 hover:bg-purple-50">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to History
              </Button>
            </Link>
            <Link to={createPageUrl("Analyze")} className="flex-1">
              <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6">
                Analyze Another
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
