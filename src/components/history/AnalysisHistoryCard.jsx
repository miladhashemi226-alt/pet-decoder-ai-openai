import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Eye, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { formatRelativeTime } from "@/components/utils/dateFormatter";

export default function AnalysisHistoryCard({ analysis, pet }) {
  if (!analysis) return null;

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getEmotionIcon = (emotion) => {
    const emotionLower = emotion?.toLowerCase() || "";
    
    if (emotionLower.includes("happy")) return "😊";
    if (emotionLower.includes("playful")) return "🤪";
    if (emotionLower.includes("excited")) return "🤩";
    if (emotionLower.includes("affectionate")) return "🥰";
    if (emotionLower.includes("content")) return "😌";
    if (emotionLower.includes("relaxed")) return "😊";
    if (emotionLower.includes("calm")) return "😌";
    if (emotionLower.includes("sleepy") || emotionLower.includes("tired")) return "😴";
    if (emotionLower.includes("neutral")) return "😐";
    if (emotionLower.includes("alert")) return "👀";
    if (emotionLower.includes("curious") || emotionLower.includes("interested")) return "🤔";
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
    if (emotionLower.includes("submissive")) return "😌";
    if (emotionLower.includes("pain")) return "😖";
    if (emotionLower.includes("nervous")) return "😬";
    if (emotionLower.includes("withdrawn")) return "😞";
    if (emotionLower.includes("jealous")) return "😒";
    if (emotionLower.includes("territorial")) return "🚩";
    if (emotionLower.includes("hunting")) return "🎯";
    if (emotionLower.includes("protective")) return "🛡️";
    if (emotionLower.includes("confident")) return "😎";
    if (emotionLower.includes("suspicious")) return "🧐";
    if (emotionLower.includes("restless")) return "😣";
    if (emotionLower.includes("overstimulated")) return "🤯";
    
    return "😐";
  };

  const getEmotionColor = (emotion) => {
    const emotionLower = emotion?.toLowerCase() || "";
    
    if (emotionLower.includes("happy") || emotionLower.includes("playful") || emotionLower.includes("excited")) {
      return "bg-green-100 text-green-700 border-green-300";
    }
    if (emotionLower.includes("calm") || emotionLower.includes("relaxed") || emotionLower.includes("content")) {
      return "bg-blue-100 text-blue-700 border-blue-300";
    }
    if (emotionLower.includes("anxious") || emotionLower.includes("stressed") || emotionLower.includes("nervous")) {
      return "bg-orange-100 text-orange-700 border-orange-300";
    }
    if (emotionLower.includes("aggressive") || emotionLower.includes("fearful") || emotionLower.includes("distressed")) {
      return "bg-red-100 text-red-700 border-red-300";
    }
    if (emotionLower.includes("tired") || emotionLower.includes("sleepy") || emotionLower.includes("bored")) {
      return "bg-purple-100 text-purple-700 border-purple-300";
    }
    
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 85) return "bg-green-100 text-green-700 border-green-300";
    if (confidence >= 70) return "bg-blue-100 text-blue-700 border-blue-300";
    if (confidence >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-orange-100 text-orange-700 border-orange-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-none shadow-lg hover:shadow-xl transition-all bg-white/90 backdrop-blur-sm overflow-hidden">
        {analysis.video_url && (
          <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
            {analysis.video_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={analysis.video_url}
                alt="Analysis media"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                  e.target.parentElement.innerHTML = '<div class="text-6xl">📹</div>';
                }}
              />
            ) : (
              <video
                src={analysis.video_url}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                  e.target.parentElement.innerHTML = '<div class="text-6xl">📹</div>';
                }}
              />
            )}
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {pet && (
                <div className="flex items-center gap-2 mb-2">
                  {pet.photo_url && (
                    <img
                      src={pet.photo_url}
                      alt={pet.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="font-semibold text-gray-900">{pet.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4" />
                <span>{formatRelativeTime(analysis.created_date)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-3xl">{getEmotionIcon(analysis.emotion_detected)}</span>
              <Badge className={`${getEmotionColor(analysis.emotion_detected)} font-semibold`}>
                {capitalizeFirst(analysis.emotion_detected)}
              </Badge>
              {analysis.confidence_level > 0 && (
                <Badge className={getConfidenceColor(analysis.confidence_level)}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {analysis.confidence_level}% confident
                </Badge>
              )}
            </div>

            {analysis.behavior_summary && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {analysis.behavior_summary}
              </p>
            )}

            <Link to={createPageUrl("AnalysisDetail") + `?id=${analysis.id}`}>
              <Button 
                variant="outline" 
                className="w-full border-purple-300 hover:bg-purple-50 mt-2"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Full Analysis
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}