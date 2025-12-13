import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle2, Lock } from "lucide-react";

export default function AchievementCard({ achievement, showProgress = false }) {
  const rarityColors = {
    common: "border-gray-300 bg-gray-50",
    rare: "border-blue-300 bg-blue-50",
    epic: "border-purple-300 bg-purple-50",
    legendary: "border-orange-300 bg-gradient-to-br from-yellow-50 to-orange-50"
  };

  const rarityBadges = {
    common: "bg-gray-100 text-gray-700",
    rare: "bg-blue-100 text-blue-700",
    epic: "bg-purple-100 text-purple-700",
    legendary: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
  };

  const progressPercentage = achievement.total 
    ? Math.min((achievement.progress / achievement.total) * 100, 100)
    : 100;

  return (
    <motion.div
      whileHover={{ scale: achievement.earned ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`border-2 ${achievement.earned ? rarityColors[achievement.rarity] : 'bg-gray-100 opacity-60'} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`text-4xl ${!achievement.earned && 'grayscale opacity-50'}`}>
              {achievement.earned ? achievement.icon : <Lock className="w-10 h-10 text-gray-400" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                {achievement.earned && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={rarityBadges[achievement.rarity]} variant="secondary">
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </Badge>
                {achievement.category && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.category}
                  </Badge>
                )}
              </div>
              {showProgress && achievement.total && !achievement.earned && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}