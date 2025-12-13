
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client"; // Changed: Explicitly import base44
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, PieChart, BarChart3, Calendar, AlertCircle, Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInDays, startOfWeek, startOfMonth, format, parseISO } from "date-fns";

import EmotionChart from "../components/trends/EmotionChart";
import ConfidenceTrend from "../components/trends/ConfidenceTrend";
import SEO from "../components/common/SEO";
import { handleAuthError, getFriendlyErrorMessage } from "../components/utils/errorHandler";

const ITEMS_PER_PAGE = 30; // Reduced from 50

export default function Trends() {
  const [analyses, setAnalyses] = useState([]);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("all");
  const [timeRange, setTimeRange] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check authentication first. If it fails, the catch block will handle it.
      // Assuming 'base44' is a globally available object or imported elsewhere as an SDK wrapper.
      const currentUser = await base44.auth.me();
      setUser(currentUser); // Set user state if needed for other parts of the component

      const [analysesData, petsData] = await Promise.all([
        base44.entities.Analysis.list("-created_date", ITEMS_PER_PAGE), // Reduced initial fetch
        base44.entities.Pet.list()
      ]);

      setAnalyses(Array.isArray(analysesData) ? analysesData : []);
      setPets(Array.isArray(petsData) ? petsData : []);
      
      if (petsData && petsData.length > 0) {
        setSelectedPet(petsData[0].id); // Set to the first pet's ID if pets exist
      }
    } catch (err) {
      console.error("Error loading trends data:", err);
      
      // Handle authentication errors - this will redirect if it's a 401
      if (handleAuthError(err)) {
        return; // Stop further execution if it's an auth error and handled
      }
      
      // Show user-friendly error for other types of errors
      setError(getFriendlyErrorMessage(err));
      setAnalyses([]);
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPetById = (petId) => {
    if (!Array.isArray(pets) || pets.length === 0) return null;
    return pets.find(p => p && p.id === petId) || null;
  };

  const filteredAnalyses = useMemo(() => {
    if (!Array.isArray(analyses)) return [];

    let filtered = [...analyses];

    // Filter by pet
    if (selectedPet !== "all") {
      filtered = filtered.filter(a => a && a.pet_id === selectedPet);
    }

    // Filter by time range
    const now = new Date();
    const ranges = {
      week: () => {
        const start = startOfWeek(now);
        return (a) => {
          if (!a || !a.created_date) return false;
          try {
            return new Date(a.created_date) >= start;
          } catch {
            return false;
          }
        };
      },
      month: () => {
        const start = startOfMonth(now);
        return (a) => {
          if (!a || !a.created_date) return false;
          try {
            return new Date(a.created_date) >= start;
          } catch {
            return false;
          }
        };
      },
      "3months": () => {
        const start = new Date(now);
        start.setMonth(start.getMonth() - 3);
        return (a) => {
          if (!a || !a.created_date) return false;
          try {
            return new Date(a.created_date) >= start;
          } catch {
            return false;
          }
        };
      },
      year: () => {
        const start = new Date(now);
        start.setFullYear(start.getFullYear() - 1);
        return (a) => {
          if (!a || !a.created_date) return false;
          try {
            return new Date(a.created_date) >= start;
          } catch {
            return false;
          }
        };
      },
      all: () => () => true
    };

    if (ranges[timeRange]) {
      filtered = filtered.filter(ranges[timeRange]());
    }

    return filtered.filter(a => a && a.emotion_detected);
  }, [analyses, selectedPet, timeRange]);

  const emotionData = useMemo(() => {
    if (!Array.isArray(filteredAnalyses) || filteredAnalyses.length === 0) return [];

    const emotionCounts = {};
    filteredAnalyses.forEach(a => {
      if (a && a.emotion_detected) {
        // Ensure consistent capitalization for EmotionChart
        const emotion = a.emotion_detected.charAt(0).toUpperCase() + a.emotion_detected.slice(1).toLowerCase();
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      }
    });

    return Object.entries(emotionCounts)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: Math.round((count / filteredAnalyses.length) * 100)
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredAnalyses]);

  const confidenceData = useMemo(() => {
    if (!Array.isArray(filteredAnalyses) || filteredAnalyses.length === 0) return [];

    // Filter analyses with valid confidence
    const dataWithValidConfidence = filteredAnalyses
      .filter(a => a && a.confidence_level != null && !isNaN(Number(a.confidence_level)) && Number(a.confidence_level) > 0)
      .map(a => ({
        date: a.created_date,
        confidence: Number(a.confidence_level),
        emotion: a.emotion_detected
      }))
      .sort((a, b) => {
        try {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        } catch {
          return 0;
        }
      });

    if (dataWithValidConfidence.length === 0) return [];

    // Helper function to capitalize first letter
    const capitalizeEmotion = (emotion) => {
      if (!emotion || typeof emotion !== 'string') return null;
      return emotion.charAt(0).toUpperCase() + emotion.slice(1).toLowerCase();
    };

    // Aggregate by date - calculate average confidence per day
    const aggregatedByDate = {};
    
    dataWithValidConfidence.forEach(item => {
      try {
        const dateObj = parseISO(item.date);
        // Create date key without time (YYYY-MM-DD)
        const dateKey = format(dateObj, 'yyyy-MM-dd');
        
        if (!aggregatedByDate[dateKey]) {
          aggregatedByDate[dateKey] = {
            date: dateKey,
            confidenceSum: 0,
            count: 0,
            emotions: []
          };
        }
        
        aggregatedByDate[dateKey].confidenceSum += item.confidence;
        aggregatedByDate[dateKey].count += 1;
        if (item.emotion) {
          // Normalize emotion to lowercase for counting
          aggregatedByDate[dateKey].emotions.push(item.emotion.toLowerCase());
        }
      } catch (error) {
        console.error("Error aggregating date:", error, item.date);
      }
    });

    // Convert aggregated data to array with averaged confidence
    const aggregatedArray = Object.values(aggregatedByDate)
      .map(day => {
        // Calculate average confidence for the day
        const avgConfidence = Math.round(day.confidenceSum / day.count);
        
        // Get most common emotion for the day
        let mostCommonEmotion = null;
        if (day.emotions.length > 0) {
          const emotionCounts = {};
          day.emotions.forEach(emotion => {
            const normalized = emotion.toLowerCase();
            emotionCounts[normalized] = (emotionCounts[normalized] || 0) + 1;
          });
          const topEmotion = Object.entries(emotionCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0];
          
          // Capitalize first letter for display
          mostCommonEmotion = capitalizeEmotion(topEmotion);
        }
        
        return {
          date: day.date,
          confidence: avgConfidence,
          emotion: mostCommonEmotion,
          analysisCount: day.count
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return aggregatedArray;
  }, [filteredAnalyses]);

  const avgConfidence = useMemo(() => {
    if (confidenceData.length === 0) return 0;
    const sum = confidenceData.reduce((acc, d) => acc + d.confidence, 0);
    // Average of daily averages, not raw analyses. This is appropriate for the chart.
    return Math.round(sum / confidenceData.length);
  }, [confidenceData]);

  const topEmotion = useMemo(() => {
    if (emotionData.length === 0) return null;
    return emotionData[0];
  }, [emotionData]);

  const emotionTrend = useMemo(() => {
    if (emotionData.length === 0) return "No data";
    
    const positiveEmotions = ['happy', 'playful', 'excited', 'content', 'affectionate', 'relaxed', 'calm'];
    const positiveCount = emotionData
      .filter(e => positiveEmotions.some(pos => e.emotion.toLowerCase().includes(pos)))
      .reduce((sum, e) => sum + e.count, 0);
    
    const positivePercentage = Math.round((positiveCount / filteredAnalyses.length) * 100);
    
    if (positivePercentage >= 70) return "Very Positive";
    if (positivePercentage >= 50) return "Mostly Positive";
    if (positivePercentage >= 30) return "Mixed";
    return "Needs Attention";
  }, [emotionData, filteredAnalyses]);

  const timeRangeLabels = {
    week: "Past Week",
    month: "Past Month",
    "3months": "Past 3 Months",
    year: "Past Year",
    all: "All Time"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading behavior trends...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Behavior Trends - Analyze Patterns | Pet Decoder AI"
        description="Visualize your pet's behavioral patterns and emotional trends over time with interactive charts and insights."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Behavior Trends
                </h1>
                <p className="text-gray-600">Visualize patterns and track changes over time</p>
              </div>
            </div>
          </motion.div>

          {error && (
            <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-purple-100">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Pet</label>
                  <Select value={selectedPet} onValueChange={setSelectedPet}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Pets" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pets</SelectItem>
                      {Array.isArray(pets) && pets.map(pet => (
                        <SelectItem key={pet.id} value={pet.id}>
                          {pet.species === 'dog' ? '🐕' : '🐈'} {pet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="3months">Past 3 Months</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredAnalyses.length === 0 ? (
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">No Data Available</h3>
                <p className="text-gray-600 mb-6">
                  {selectedPet !== "all" || timeRange !== "all"
                    ? "No analyses found for the selected filters. Try adjusting your filter settings."
                    : "Start analyzing your pet's behavior to see trends and patterns."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-none shadow-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm opacity-90">Total Analyses</p>
                        <Calendar className="w-5 h-5 opacity-75" />
                      </div>
                      <div className="text-4xl font-bold">{filteredAnalyses.length}</div>
                      <p className="text-xs opacity-75 mt-2">{timeRangeLabels[timeRange]}</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-none shadow-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm opacity-90">Avg Confidence</p>
                        <TrendingUp className="w-5 h-5 opacity-75" />
                      </div>
                      <div className="text-4xl font-bold">{avgConfidence}%</div>
                      <p className="text-xs opacity-75 mt-2">
                        {confidenceData.length > 0 ? `Based on ${filteredAnalyses.length} analyses` : 'No confidence data'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-none shadow-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm opacity-90">Overall Trend</p>
                        <PieChart className="w-5 h-5 opacity-75" />
                      </div>
                      <div className="text-2xl font-bold">{emotionTrend}</div>
                      {topEmotion && (
                        <p className="text-xs opacity-75 mt-2">
                          Most common: {topEmotion.emotion} ({topEmotion.percentage}%)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <EmotionChart data={emotionData} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ConfidenceTrend data={confidenceData} />
                </motion.div>
              </div>

              {/* Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <Card className="border-none shadow-xl bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-semibold mb-2">Insights:</p>
                        <ul className="list-disc ml-5 space-y-1">
                          {emotionData.length > 0 && (
                            <li>
                              Your pet shows <strong>{topEmotion.emotion.toLowerCase()}</strong> behavior most frequently ({topEmotion.percentage}% of the time).
                            </li>
                          )}
                          {avgConfidence > 0 && (
                            <li>
                              Average AI confidence level is <strong>{avgConfidence}%</strong>
                              {avgConfidence >= 85 ? ", indicating high accuracy in behavioral detection." : avgConfidence >= 70 ? ", showing good reliability in analysis." : ". Consider uploading clearer videos for better accuracy."}
                            </li>
                          )}
                          <li>
                            Analyzed <strong>{filteredAnalyses.length}</strong> behavior{filteredAnalyses.length !== 1 ? 's' : ''} in the selected time period.
                          </li>
                          {emotionData.length >= 3 && (
                            <li>
                              Top 3 emotions detected: {emotionData.slice(0, 3).map(e => e.emotion).join(', ')}.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
