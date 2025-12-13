
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Upload, TrendingUp, ArrowRight, Award, Gift, PawPrint, Smile, Target } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, parseISO } from "date-fns";

import StatsCard from "../components/dashboard/StatsCard";
import RecentAnalysisCard from "../components/dashboard/RecentAnalysisCard";
import EmptyState from "../components/dashboard/EmptyState";
import AchievementCard from "../components/dashboard/AchievementCard";
import InsightCard from "../components/dashboard/InsightCard";
import SEO from "../components/common/SEO";
import { handleAuthError, getFriendlyErrorMessage, isAuthError } from "../components/utils/errorHandler";

const ANALYSES_PAGE_SIZE = 20; // Reduced from 50 for faster initial load

const BirthdayBanner = ({ pets }) => {
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    try {
      const birthDate = parseISO(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      console.error("Error calculating age for birthday:", birthday, error);
      return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-r from-yellow-300 to-orange-400 p-4 rounded-lg shadow-md mb-8 flex items-center justify-between text-white"
      role="banner"
      aria-label="Pet birthday notification"
    >
      <div className="flex items-center">
        <Gift className="w-8 h-8 mr-3 animate-bounce" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-bold">Happy Birthday!</h2>
          <p className="text-sm">
            {pets.map((pet, index) => {
              const age = calculateAge(pet.birthday);
              return (
                <span key={pet.id}>
                  It's {pet.name}'s {age ? `${age}-year` : ""} birthday today!
                  {index < pets.length - 1 && ", "}
                </span>
              );
            })}
          </p>
        </div>
      </div>
      <Link to={createPageUrl("PetProfile")}>
        <Button
          variant="ghost"
          className="text-white hover:bg-white hover:text-orange-500 transition-colors duration-200"
        >
          Celebrate! <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
};

export default function Dashboard() {
  const [analyses, setAnalyses] = useState([]);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [analysesError, setAnalysesError] = useState(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    setIsLoading(true);
    setAnalysesError(null);
    
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      if (!currentUser.onboarding_completed) {
        window.location.href = createPageUrl("Onboarding");
        return;
      }

      await loadData();
    } catch (error) {
      console.error("Authentication check failed:", error);
      
      // Handle 401 errors by redirecting to landing
      if (handleAuthError(error)) {
        return;
      }
      
      // For other errors, still redirect to landing as user is not authenticated
      console.log("Redirecting to landing page due to authentication failure");
      window.location.href = createPageUrl("Landing");
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    setAnalysesError(null);
    
    try {
      // Load minimal data for dashboard - only recent items
      const [analysesData, petsData] = await Promise.all([
        base44.entities.Analysis.list("-created_date", ANALYSES_PAGE_SIZE).catch(err => {
          console.error("Failed to load analyses:", err);
          
          // Check if it's an auth error
          if (isAuthError(err)) {
            throw err; // Re-throw to be caught by parent
          }
          
          setAnalysesError(getFriendlyErrorMessage(err));
          return [];
        }),
        base44.entities.Pet.list().catch(err => {
          console.error("Failed to load pets:", err);
          
          // Check if it's an auth error
          if (isAuthError(err)) {
            throw err; // Re-throw to be caught by parent
          }
          
          return [];
        })
      ]);
      
      setAnalyses(Array.isArray(analysesData) ? analysesData : []);
      setPets(Array.isArray(petsData) ? petsData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      
      // Handle auth errors
      if (handleAuthError(error)) {
        return;
      }
      
      // If not an auth error, show error message
      setAnalysesError(getFriendlyErrorMessage(error));
      setAnalyses([]);
      setPets([]);
    } finally {
      // setIsLoading(false) is called in checkAuthAndLoadData's finally block
      // as loadData is always called from checkAuthAndLoadData
    }
  };

  const getPetById = (petId) => {
    if (!Array.isArray(pets) || pets.length === 0) return null;
    return pets.find(p => p && p.id === petId) || null;
  };

  const isBirthdayToday = (birthday) => {
    if (!birthday) return false;
    try {
      const birthDate = parseISO(birthday);
      if (isNaN(birthDate.getTime())) return false;

      const today = new Date();
      return birthDate.getMonth() === today.getMonth() && birthDate.getDate() === today.getDate();
    } catch (error) {
      console.error("Error parsing birthday date:", birthday, error);
      return false;
    }
  };

  // Memoize expensive calculations
  const birthdayPets = useMemo(() => {
    if (!Array.isArray(pets)) return [];
    return pets.filter(pet => pet && pet.birthday && isBirthdayToday(pet.birthday));
  }, [pets]);

  const topEmotion = useMemo(() => {
    if (!Array.isArray(analyses) || analyses.length === 0) return null;
    
    const emotionCounts = {};
    analyses.forEach(a => {
      if (a && a.emotion_detected) {
        const emotion = a.emotion_detected.charAt(0).toUpperCase() + a.emotion_detected.slice(1).toLowerCase();
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
    });
    
    const sortedEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]);
    return sortedEmotions.length > 0 ? sortedEmotions[0][0] : null;
  }, [analyses]);

  const analysesWithConfidence = useMemo(() => {
    if (!Array.isArray(analyses)) return [];
    return analyses.filter(a => 
      a && 
      a.confidence_level != null && 
      !isNaN(Number(a.confidence_level)) &&
      Number(a.confidence_level) > 0
    );
  }, [analyses]);

  const avgConfidence = useMemo(() => {
    if (analysesWithConfidence.length === 0) return 0;
    const sum = analysesWithConfidence.reduce((acc, a) => acc + Number(a.confidence_level), 0);
    return Math.round(sum / analysesWithConfidence.length);
  }, [analysesWithConfidence]);

  const recentAnalyses = useMemo(() => 
    Array.isArray(analyses) ? analyses.slice(0, 5) : []
  , [analyses]);

  // Optimize consecutive days calculation
  const consecutiveDays = useMemo(() => {
    if (!Array.isArray(analyses) || analyses.length === 0) return 0;

    try {
      const analysisDates = analyses
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
      currentDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

      const todayStr = currentDate.toDateString();
      const yesterdayStr = new Date(currentDate.getTime() - 86400000).toDateString(); // 24 hours in milliseconds

      if (uniqueDates.includes(todayStr)) {
        streak = 1;
      } else if (uniqueDates.includes(yesterdayStr)) {
        streak = 1;
        currentDate = new Date(currentDate.getTime() - 86400000); // Move current date back to yesterday
      } else {
        return 0;
      }

      for (let i = 1; i < uniqueDates.length; i++) {
        currentDate = new Date(currentDate.getTime() - 86400000);
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
  }, [analyses]);

  const last7DaysAnalyses = useMemo(() => {
    if (!Array.isArray(analyses)) return [];
    return analyses.filter(a => {
      try {
        return differenceInDays(new Date(), parseISO(a.created_date)) <= 7;
      } catch {
        return false;
      }
    });
  }, [analyses]);

  const happyAnalyses = useMemo(() => 
    Array.isArray(analyses)
      ? analyses.filter(a =>
          a.emotion_detected?.toLowerCase().includes('happy') ||
          a.emotion_detected?.toLowerCase().includes('playful') ||
          a.emotion_detected?.toLowerCase().includes('excited') ||
          a.emotion_detected?.toLowerCase().includes('content') ||
          a.emotion_detected?.toLowerCase().includes('affectionate')
        ).length
      : 0
  , [analyses]);

  const highConfidenceCount = useMemo(() => 
    Array.isArray(analyses)
      ? analyses.filter(a => Number(a.confidence_level) >= 85).length
      : 0
  , [analyses]);

  const achievements = useMemo(() => [
    {
      id: 'first_step',
      title: "First Step",
      description: "Completed your first pet behavior analysis",
      earned: Array.isArray(analyses) && analyses.length >= 1,
      icon: "🎯",
      category: "Getting Started",
      rarity: "common"
    },
    {
      id: 'pet_profiler',
      title: "Pet Profiler",
      description: "Added your first pet profile",
      earned: Array.isArray(pets) && pets.length >= 1,
      icon: "🐾",
      category: "Getting Started",
      rarity: "common"
    },
    {
      id: 'weekly_tracker',
      title: "Weekly Tracker",
      description: "Analyzed your pet's behavior for 7 consecutive days",
      earned: consecutiveDays >= 7,
      icon: "📅",
      category: "Consistency",
      rarity: "rare"
    },
    {
      id: 'analyst_pro',
      title: "Analysis Pro",
      description: "Completed 20 behavior analyses",
      earned: Array.isArray(analyses) && analyses.length >= 20,
      icon: "📈",
      category: "Analysis Milestones",
      rarity: "rare"
    },
  ], [analyses, pets, consecutiveDays]);

  const earnedAchievements = useMemo(() => 
    achievements.filter(a => a.earned)
  , [achievements]);

  const recentAchievements = useMemo(() => 
    earnedAchievements.slice(-4)
  , [earnedAchievements]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Dashboard - Pet Behavior Insights | Pet Decoder AI"
        description="View your pet's behavior analysis history, insights, and track their emotional patterns over time."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Welcome Back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
              </h1>
              <p className="text-gray-600 mt-2">Let's decode your pet's behavior today</p>
            </div>
            <Link to={createPageUrl("Analyze")}>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <Upload className="w-5 h-5 mr-2" />
                Analyze Video
              </Button>
            </Link>
          </motion.div>

          {birthdayPets.length > 0 && (
            <BirthdayBanner pets={birthdayPets} />
          )}

          {topEmotion && analyses.length > 0 && Array.isArray(pets) && pets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <InsightCard
                emotion={topEmotion}
                analysisCount={recentAnalyses.length}
                petName={pets[0]?.name || "Your pet"}
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Analyses"
              value={Array.isArray(analyses) ? analyses.length : 0}
              icon={TrendingUp}
              color="purple"
            />
            <StatsCard
              title="Pets Registered"
              value={Array.isArray(pets) ? pets.length : 0}
              icon={PawPrint}
              color="pink"
            />
            <StatsCard
              title="Most Common"
              value={topEmotion || "N/A"}
              icon={Smile}
              color="blue"
            />
            <StatsCard
              title="Avg Confidence"
              value={analysesWithConfidence.length > 0 ? `${avgConfidence}%` : "0%"}
              icon={Target}
              color="amber"
            />
          </div>

          {earnedAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="border-b border-purple-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-6 h-6" />
                      Recent Achievements
                    </CardTitle>
                    <Link to={createPageUrl("Achievements")}>
                      <Button variant="ghost" size="sm" className="text-purple-600">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {recentAchievements.map((achievement) => (
                      <AchievementCard key={achievement.id} achievement={achievement} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Analyses</CardTitle>
                  {Array.isArray(analyses) && analyses.length > 0 && (
                    <Link to={createPageUrl("History")}>
                      <Button variant="ghost" size="sm" className="text-purple-600">
                        View All
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {analysesError && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">{analysesError}</p>
                  </div>
                )}
                {!Array.isArray(analyses) || analyses.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-4">
                    {recentAnalyses.map((analysis) => (
                      <RecentAnalysisCard
                        key={analysis.id}
                        analysis={analysis}
                        pet={getPetById(analysis.pet_id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="border-b border-purple-100">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Link to={createPageUrl("Analyze")}>
                  <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                    <Upload className="w-5 h-5 mr-3" />
                    Analyze New Video
                  </Button>
                </Link>
                <Link to={createPageUrl("PetProfile") + "?add=true"}>
                  <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
                    <PawPrint className="w-5 h-5 mr-3" />
                    Manage Pet Profiles
                  </Button>
                </Link>
                <Link to={createPageUrl("History")}>
                  <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
                    <TrendingUp className="w-5 h-5 mr-3" />
                    View Analysis History
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
