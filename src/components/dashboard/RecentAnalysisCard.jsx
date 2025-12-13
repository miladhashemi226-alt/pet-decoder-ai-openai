import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { formatRelativeTime } from "@/components/utils/dateFormatter";

export default function RecentAnalysisCard({ analysis, pet }) {
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

  return (
    <Link to={createPageUrl("AnalysisDetail") + `?id=${analysis.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            {pet?.photo_url && (
              <img
                src={pet.photo_url}
                alt={pet.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-gray-900">{pet?.name || "Unknown Pet"}</p>
              <p className="text-xs text-gray-500">
                {formatRelativeTime(analysis.created_date)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getEmotionIcon(analysis.emotion_detected)}</span>
          <span className="font-medium text-gray-900">{capitalizeFirst(analysis.emotion_detected)}</span>
          {analysis.confidence_level > 0 && (
            <Badge variant="outline" className="ml-auto">
              {analysis.confidence_level}%
            </Badge>
          )}
        </div>
      </motion.div>
    </Link>
  );
}