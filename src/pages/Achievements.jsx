import React, { useState, useEffect } from "react";
import { Analysis, Pet, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Lock, TrendingUp, ArrowRight, Trophy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { differenceInDays, parseISO } from "date-fns";

import AchievementCard from "../components/dashboard/AchievementCard";
import SEO from "../components/common/SEO";
import { handleAuthError, getFriendlyErrorMessage } from "../components/utils/errorHandler";

const isAuthError = (error) => {
  return error && error.response && error.response.status === 401;
};

const Leaderboard = ({ users, currentUserId }) => {
  return (
    <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Top 10 Achievers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No users found for leaderboard.</p>
          ) : (
            users.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  user.id === currentUserId
                    ? "bg-purple-100 border-l-4 border-purple-500"
                    : "bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                }`}
              >
                <div className="flex items-center">
                  <Badge
                    className={`mr-3 text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                      index === 0 ? "bg-yellow-400 text-black" :
                      index === 1 ? "bg-gray-300 text-black" :
                      index === 2 ? "bg-amber-700 text-white" :
                      "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {user.id === currentUserId
                        ? (user.full_name || user.email)
                        : (user.full_name || "Pet Parent")}
                    </p>
                    {user.id === currentUserId && (
                      <p className="text-sm text-gray-500">{user.email}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-purple-600">{user.achievementCount}</p>
                  <p className="text-xs text-gray-500">achievements</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};


export default function Achievements() {
  const [analyses, setAnalyses] = useState([]);
  const [pets, setPets] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const calculateConsecutiveDays = (userAnalyses) => {
    if (!Array.isArray(userAnalyses) || userAnalyses.length === 0) return 0;

    try {
      const analysisDates = userAnalyses
        .map(a => {
          try {
            return a.created_date ? parseISO(a.created_date) : null;
          } catch {
            return null;
          }
        })
        .filter(date => date && !isNaN(date.getTime()))
        .sort((a, b) => b.getTime() - a.getTime());

      if (analysisDates.length === 0) return 0;

      const uniqueDates = [...new Set(analysisDates.map(date => date.toDateString()))];
      
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const todayStr = currentDate.toDateString();
      const yesterdayStr = new Date(currentDate.getTime() - 86400000).toDateString();

      if (uniqueDates.includes(todayStr)) {
        streak = 1;
      } else if (uniqueDates.includes(yesterdayStr)) {
        streak = 1;
        currentDate = new Date(currentDate.getTime() - 86400000);
      } else {
        return 0;
      }

      for (let i = 1; i < uniqueDates.length; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        if (uniqueDates.includes(currentDate.toDateString())) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    } catch (error) {
      console.error("Error calculating consecutive days:", error);
      return 0;
    }
  };


  const loadData = async () => {
    setIsLoading(true);

    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);

      if (!currentUser) {
        return;
      }

      const [analysesData, petsData] = await Promise.all([
        Analysis.list("-created_date", 200).catch((err) => {
          console.error("Failed to load analyses:", err);
          if (isAuthError(err)) throw err;
          return [];
        }),
        Pet.list().catch((err) => {
          console.error("Failed to load pets:", err);
          if (isAuthError(err)) throw err;
          return [];
        })
      ]);

      setAnalyses(Array.isArray(analysesData) ? analysesData : []);
      setPets(Array.isArray(petsData) ? petsData : []);

      if (currentUser.role === 'admin') {
        await loadLeaderboard(currentUser);
      } else {
        setLeaderboardData([]);
      }

    } catch (error) {
      console.error("Error loading achievements:", error);
      
      if (handleAuthError(error)) {
        return;
      }
      
      setIsAuthenticated(false);
      setUser(null);
      setAnalyses([]);
      setPets([]);
      setLeaderboardData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboard = async (currentUser) => {
    setIsLoadingLeaderboard(true);
    try {
      const allUsers = await User.list().catch((err) => {
        console.error("Error listing all users for leaderboard:", err);
        if (isAuthError(err)) throw err;
        return [];
      });
      
      if (!Array.isArray(allUsers) || allUsers.length === 0) {
        setLeaderboardData([]);
        return;
      }

      const usersWithAchievements = await Promise.all(
        allUsers.map(async (user) => {
          try {
            const [userAnalyses, userPets] = await Promise.all([
              Analysis.filter({ created_by: user.email }, "-created_date", 200).catch((err) => {
                console.error(`Error filtering analyses for ${user.email}:`, err);
                if (isAuthError(err)) throw err;
                return [];
              }),
              Pet.filter({ created_by: user.email }).catch((err) => {
                console.error(`Error filtering pets for ${user.email}:`, err);
                if (isAuthError(err)) throw err;
                return [];
              })
            ]);

            const analysesForUser = Array.isArray(userAnalyses) ? userAnalyses : [];
            const petsForUser = Array.isArray(userPets) ? userPets : [];

            let achievementCount = 0;
            
            if (analysesForUser.length >= 1) achievementCount++;
            if (petsForUser.length >= 1) achievementCount++;
            if (user.onboarding_completed) achievementCount++;
            if (analysesForUser.length >= 5) achievementCount++;
            if (analysesForUser.length >= 20) achievementCount++;
            if (analysesForUser.length >= 50) achievementCount++;
            if (analysesForUser.length >= 100) achievementCount++;
            
            const consecutiveDaysForUser = calculateConsecutiveDays(analysesForUser);
            if (consecutiveDaysForUser >= 7) achievementCount++;
            if (consecutiveDaysForUser >= 14) achievementCount++;
            if (consecutiveDaysForUser >= 30) achievementCount++;
            
            const last7DaysAnalysesForUser = analysesForUser.filter(a => {
              try {
                return differenceInDays(new Date(), parseISO(a.created_date)) <= 7;
              } catch {
                return false;
              }
            });
            if (last7DaysAnalysesForUser.length >= 5) achievementCount++;
            
            if (petsForUser.length >= 2) achievementCount++;
            if (petsForUser.length >= 3) achievementCount++;
            
            const hasBirthday = petsForUser.some(p => p.birthday && p.birthday.trim() !== '');
            if (hasBirthday) achievementCount++;
            
            const happyAnalysesForUser = analysesForUser.filter(a => 
              a.emotion_detected?.toLowerCase().includes('happy') || 
              a.emotion_detected?.toLowerCase().includes('playful') ||
              a.emotion_detected?.toLowerCase().includes('excited') ||
              a.emotion_detected?.toLowerCase().includes('content') ||
              a.emotion_detected?.toLowerCase().includes('affectionate')
            ).length;
            if (happyAnalysesForUser >= 10) achievementCount++;
            if (happyAnalysesForUser >= 25) achievementCount++;
            
            const uniqueEmotionsForUser = new Set(analysesForUser.map(a => a.emotion_detected?.toLowerCase())).size;
            if (uniqueEmotionsForUser >= 5) achievementCount++;
            
            const highConfidenceCountForUser = analysesForUser.filter(a => Number(a.confidence_level) >= 85).length;
            if (highConfidenceCountForUser >= 5) achievementCount++;
            if (highConfidenceCountForUser >= 15) achievementCount++;
            
            if (user.created_date && differenceInDays(new Date(), parseISO(user.created_date)) >= 7) {
              achievementCount++;
            }
            
            const nightOwlForUser = analysesForUser.some(a => {
              try {
                const hour = new Date(a.created_date).getHours();
                return hour >= 0 && hour < 6;
              } catch {
                return false;
              }
            });
            if (nightOwlForUser) achievementCount++;
            
            const weekendAnalysesForUser = analysesForUser.filter(a => {
              try {
                const day = new Date(a.created_date).getDay();
                return day === 0 || day === 6;
              } catch {
                return false;
              }
            });
            if (weekendAnalysesForUser.length >= 2) achievementCount++;
            
            const isCurrentUser = currentUser && user.id === currentUser.id;
            
            return {
              id: user.id,
              full_name: isCurrentUser ? user.full_name : null,
              email: isCurrentUser ? user.email : null,
              achievementCount: achievementCount,
              analysisCount: analysesForUser.length,
              isCurrentUser: isCurrentUser
            };
          } catch (error) {
            console.error(`Error calculating achievements for user ${user.id}:`, error);
            if (isAuthError(error)) throw error;
            return {
              id: user.id,
              full_name: null,
              email: null,
              achievementCount: 0,
              analysisCount: 0,
              isCurrentUser: false
            };
          }
        })
      );

      const topUsers = usersWithAchievements
        .sort((a, b) => b.achievementCount - a.achievementCount)
        .slice(0, 10);

      setLeaderboardData(topUsers);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      
      if (handleAuthError(error)) {
        return;
      }
      
      setLeaderboardData([]);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };


  const getConsecutiveDays = () => {
    return calculateConsecutiveDays(analyses);
  };

  const consecutiveDays = getConsecutiveDays();
  const last7DaysAnalyses = analyses.filter(a => 
    differenceInDays(new Date(), new Date(a.created_date)) <= 7
  );
  const happyAnalyses = analyses.filter(a => 
    a.emotion_detected?.toLowerCase().includes('happy') || 
    a.emotion_detected?.toLowerCase().includes('playful') ||
    a.emotion_detected?.toLowerCase().includes('excited') ||
    a.emotion_detected?.toLowerCase().includes('content') ||
    a.emotion_detected?.toLowerCase().includes('affectionate')
  ).length;
  const highConfidenceCount = analyses.filter(a => Number(a.confidence_level) >= 85).length;

  const achievements = [
    {
      id: 'first_step',
      title: "First Step",
      description: "Completed your first pet behavior analysis",
      earned: analyses.length >= 1,
      icon: "🎯",
      category: "Getting Started",
      rarity: "common"
    },
    {
      id: 'pet_profiler',
      title: "Pet Profiler",
      description: "Added your first pet profile",
      earned: pets.length >= 1,
      icon: "🐾",
      category: "Getting Started",
      rarity: "common"
    },
    {
      id: 'onboarding_complete',
      title: "Journey Begins",
      description: "Completed the onboarding tutorial",
      earned: user?.onboarding_completed || false,
      icon: "🚀",
      category: "Getting Started",
      rarity: "common"
    },
    {
      id: 'analyst_novice',
      title: "Analyst Novice",
      description: "Completed 5 behavior analyses",
      earned: analyses.length >= 5,
      icon: "📊",
      category: "Analysis Milestones",
      rarity: "common",
      progress: Math.min(analyses.length, 5),
      total: 5
    },
    {
      id: 'analyst_pro',
      title: "Analysis Pro",
      description: "Completed 20 behavior analyses",
      earned: analyses.length >= 20,
      icon: "📈",
      category: "Analysis Milestones",
      rarity: "rare",
      progress: Math.min(analyses.length, 20),
      total: 20
    },
    {
      id: 'analyst_expert',
      title: "Behavior Expert",
      description: "Completed 50 behavior analyses",
      earned: analyses.length >= 50,
      icon: "🏆",
      category: "Analysis Milestones",
      rarity: "epic",
      progress: Math.min(analyses.length, 50),
      total: 50
    },
    {
      id: 'analyst_master',
      title: "Master Decoder",
      description: "Completed 100 behavior analyses",
      earned: analyses.length >= 100,
      icon: "👑",
      category: "Analysis Milestones",
      rarity: "legendary",
      progress: Math.min(analyses.length, 100),
      total: 100
    },
    {
      id: 'weekly_tracker',
      title: "Weekly Tracker",
      description: "Analyzed your pet's behavior for 7 consecutive days",
      earned: consecutiveDays >= 7,
      icon: "📅",
      category: "Consistency",
      rarity: "rare",
      progress: Math.min(consecutiveDays, 7),
      total: 7
    },
    {
      id: 'dedicated_parent',
      title: "Dedicated Parent",
      description: "Maintained a 14-day analysis streak",
      earned: consecutiveDays >= 14,
      icon: "⭐",
      category: "Consistency",
      rarity: "epic",
      progress: Math.min(consecutiveDays, 14),
      total: 14
    },
    {
      id: 'habit_master',
      title: "Habit Master",
      description: "Maintained a 30-day analysis streak",
      earned: consecutiveDays >= 30,
      icon: "💎",
      category: "Consistency",
      rarity: "legendary",
      progress: Math.min(consecutiveDays, 30),
      total: 30
    },
    {
      id: 'active_week',
      title: "Active Week",
      description: "Completed 5 analyses in the past 7 days",
      earned: last7DaysAnalyses.length >= 5,
      icon: "🔥",
      category: "Consistency",
      rarity: "common",
      progress: Math.min(last7DaysAnalyses.length, 5),
      total: 5
    },
    {
      id: 'multi_pet_parent',
      title: "Multi-Pet Parent",
      description: "Caring for 2 or more pets",
      earned: pets.length >= 2,
      icon: "👨‍👩‍👧‍👦",
      category: "Pet Care",
      rarity: "rare",
      progress: Math.min(pets.length, 2),
      total: 2
    },
    {
      id: 'pet_pack',
      title: "Pet Pack Leader",
      description: "Managing 3 or more pets",
      earned: pets.length >= 3,
      icon: "🎪",
      category: "Pet Care",
      rarity: "epic",
      progress: Math.min(pets.length, 3),
      total: 3
    },
    {
      id: 'birthday_keeper',
      title: "Birthday Keeper",
      description: "Set a birthday for your pet",
      earned: pets.length > 0 && pets.some(p => p.birthday && p.birthday.trim() !== ''),
      icon: "🎂",
      category: "Pet Care",
      rarity: "rare"
    },
    {
      id: 'happiness_ambassador',
      title: "Happiness Ambassador",
      description: "Detected 10 happy/playful moments",
      earned: happyAnalyses >= 10,
      icon: "😊",
      category: "Emotional Insights",
      rarity: "rare",
      progress: Math.min(happyAnalyses, 10),
      total: 10
    },
    {
      id: 'joy_collector',
      title: "Joy Collector",
      description: "Detected 25 happy moments",
      earned: happyAnalyses >= 25,
      icon: "🌟",
      category: "Emotional Insights",
      rarity: "epic",
      progress: Math.min(happyAnalyses, 25),
      total: 25
    },
    {
      id: 'mood_detective',
      title: "Mood Detective",
      description: "Identified 5 different emotion types",
      earned: new Set(analyses.map(a => a.emotion_detected?.toLowerCase())).size >= 5,
      icon: "🔍",
      category: "Emotional Insights",
      rarity: "rare",
      progress: Math.min(new Set(analyses.map(a => a.emotion_detected?.toLowerCase())).size, 5),
      total: 5
    },
    {
      id: 'precision_analyst',
      title: "Precision Analyst",
      description: "Achieved 5 analyses with 85%+ confidence",
      earned: highConfidenceCount >= 5,
      icon: "🎯",
      category: "Quality",
      rarity: "rare",
      progress: Math.min(highConfidenceCount, 5),
      total: 5
    },
    {
      id: 'accuracy_expert',
      title: "Accuracy Expert",
      description: "Achieved 15 analyses with 85%+ confidence",
      earned: highConfidenceCount >= 15,
      icon: "🏅",
      category: "Quality",
      rarity: "epic",
      progress: Math.min(highConfidenceCount, 15),
      total: 15
    },
    {
      id: 'early_adopter',
      title: "Early Adopter",
      description: "Joined Pet Decoder AI in its early days",
      earned: user?.created_date && differenceInDays(new Date(), parseISO(user.created_date)) >= 7,
      icon: "🌱",
      category: "Special",
      rarity: "epic"
    },
    {
      id: 'night_owl',
      title: "Night Owl",
      description: "Analyzed pet behavior after midnight",
      earned: analyses.some(a => new Date(a.created_date).getHours() >= 0 && new Date(a.created_date).getHours() < 6),
      icon: "🦉",
      category: "Special",
      rarity: "rare"
    },
    {
      id: 'weekend_warrior',
      title: "Weekend Warrior",
      description: "Analyzed pet behavior on both weekend days",
      earned: analyses.filter(a => {
        const day = new Date(a.created_date).getDay();
        return day === 0 || day === 6;
      }).length >= 2,
      icon: "🏖️",
      category: "Special",
      rarity: "common"
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  const rarityColors = {
    common: "bg-gray-100 text-gray-700 border-gray-300",
    rare: "bg-blue-100 text-blue-700 border-blue-300",
    epic: "bg-purple-100 text-purple-700 border-purple-300",
    legendary: "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-300"
  };

  const categories = ["all", ...new Set(achievements.map(a => a.category))];

  const filteredAchievements = filter === "all" 
    ? achievements 
    : achievements.filter(a => a.category === filter);

  const earnedFiltered = filteredAchievements.filter(a => a.earned);
  const lockedFiltered = filteredAchievements.filter(a => !a.earned);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Achievements - Track Your Milestones | Pet Decoder AI"
        description="View all your achievements and milestones in pet behavior analysis. Track your progress and celebrate your dedication."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Link to={createPageUrl("Dashboard")}>
                <Button variant="outline" size="icon" className="hover:bg-purple-100 border-purple-200">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Achievements
                </h1>
                <p className="text-gray-600 mt-2">
                  {earnedAchievements.length} of {achievements.length} unlocked
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-none shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-700">{achievements.filter(a => a.earned && a.rarity === 'common').length}</div>
                  <div className="text-sm text-gray-500 mt-1">Common</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-700">{achievements.filter(a => a.earned && a.rarity === 'rare').length}</div>
                  <div className="text-sm text-blue-500 mt-1">Rare</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-700">{achievements.filter(a => a.earned && a.rarity === 'epic').length}</div>
                  <div className="text-sm text-purple-500 mt-1">Epic</div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-700">{achievements.filter(a => a.earned && a.rarity === 'legendary').length}</div>
                  <div className="text-sm text-orange-500 mt-1">Legendary</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  onClick={() => setFilter(cat)}
                  size="sm"
                  className={filter === cat ? "bg-purple-600" : "border-purple-200"}
                >
                  {cat === "all" ? "All" : cat}
                </Button>
              ))}
            </div>
          </motion.div>

          {user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              {isLoadingLeaderboard ? (
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading leaderboard...</p>
                  </CardContent>
                </Card>
              ) : (
                <Leaderboard 
                  users={leaderboardData} 
                  currentUserId={user?.id}
                />
              )}
            </motion.div>
          )}

          <div className="grid gap-6">
            {earnedFiltered.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6" />
                  Unlocked ({earnedFiltered.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {earnedFiltered.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AchievementCard achievement={achievement} showProgress />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {lockedFiltered.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6" />
                  Locked ({lockedFiltered.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lockedFiltered.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AchievementCard achievement={achievement} showProgress />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}