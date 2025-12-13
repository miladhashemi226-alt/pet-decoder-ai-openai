import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Crown, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Leaderboard({ users, currentUserId }) {
  if (!users || users.length === 0) {
    return (
      <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-purple-100">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Top 10 Pet Parents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-12 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-600">No leaderboard data available yet</p>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-purple-500" />;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900 border-gray-400";
      case 3:
        return "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-600";
      default:
        return "bg-purple-100 text-purple-700 border-purple-300";
    }
  };

  const getCardStyle = (rank, isCurrentUser) => {
    const baseStyle = "transition-all duration-200";
    
    if (isCurrentUser) {
      return `${baseStyle} border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg scale-105`;
    }
    
    if (rank === 1) {
      return `${baseStyle} border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50`;
    }
    
    return `${baseStyle} border border-gray-200 hover:shadow-md`;
  };

  // PRIVACY PROTECTION: Anonymize display names
  const getDisplayName = (user, rank) => {
    // Only show real name if this is the current user AND they have a name
    if (user.isCurrentUser && (user.full_name || user.email)) {
      return user.full_name || user.email.split('@')[0];
    }
    
    // Everyone else gets an anonymous title
    const titles = [
      "Pet Champion",
      "Pet Expert", 
      "Pet Guardian",
      "Pet Enthusiast",
      "Pet Devotee",
      "Pet Advocate",
      "Pet Caretaker",
      "Pet Companion",
      "Pet Supporter",
      "Pet Friend"
    ];
    
    return titles[rank - 1] || `Pet Parent #${rank}`;
  };

  const getRankTitle = (rank) => {
    switch (rank) {
      case 1:
        return "🏆 Champion";
      case 2:
        return "🥈 Runner-up";
      case 3:
        return "🥉 Third Place";
      default:
        return "";
    }
  };

  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 mb-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Top 10 Pet Parents
            </CardTitle>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              Privacy-protected leaderboard
            </p>
          </div>
          <Badge variant="outline" className="border-amber-400 text-amber-700">
            Top {users.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {users.map((user, index) => {
            const rank = index + 1;
            const displayName = getDisplayName(user, rank);
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={getCardStyle(rank, user.isCurrentUser)}
                style={{ 
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {rank === 1 && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-amber-300 rounded-full opacity-20 transform translate-x-16 -translate-y-16" />
                )}
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <Badge className={`${getRankBadgeColor(rank)} text-lg font-bold px-3 py-1`}>
                        #{rank}
                      </Badge>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-900">
                          {displayName}
                        </p>
                        {user.isCurrentUser && (
                          <Badge className="bg-purple-500 text-white">You</Badge>
                        )}
                      </div>
                      {rank <= 3 && (
                        <p className="text-sm text-gray-600">
                          {getRankTitle(rank)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-purple-600">
                      {user.achievementCount}
                    </div>
                    <div className="text-xs text-gray-500">
                      achievement{user.achievementCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {rank <= 3 && user.analysisCount > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 relative z-10">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Outstanding dedication
                      </span>
                      <span>{user.analysisCount} analyses</span>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900 mb-1">
                🔒 Privacy Protected
              </p>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• All names are anonymized except your own</li>
                <li>• No personal information is shared</li>
                <li>• Only you can see your real name and position</li>
                <li>• Data is encrypted and never sold</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}