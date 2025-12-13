
import React, { useState, useEffect } from "react";
import { Pet } from "@/api/entities";
import { Analysis } from "@/api/entities";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Mic, Send, Loader2, Sparkles, MessageCircle, ArrowRight, XCircle, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEO from "../components/common/SEO";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleAuthError, getFriendlyErrorMessage } from "../components/utils/errorHandler";

// Helper function for checking if an error is an authentication error (e.g., 401)
const isAuthError = (error) => {
  // Check for common error structures from API calls (e.g., Axios)
  return error && error.response && error.response.status === 401;
};

export default function AskAI() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // This isLoading is for AI query primarily, but also for initial data fetch as per outline
  const [pets, setPets] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // This is specifically for the initial auth screen
  const [user, setUser] = useState(null);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [aiError, setAiError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsCheckingAuth(true); // For the full-page auth check spinner
    setIsLoading(true); // For general loading, including initial data fetch, which will disable inputs
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsAuthenticated(true); 

      const [analysesData, petsData] = await Promise.all([
        Analysis.list("-created_date", 200).catch(err => {
          console.error("Failed to load analyses:", err);
          if (isAuthError(err)) throw err; // Re-throw auth errors for main catch block
          return []; // Non-auth errors or successful empty list
        }),
        Pet.list().catch(err => {
          console.error("Failed to load pets:", err);
          if (isAuthError(err)) throw err; // Re-throw auth errors for main catch block
          return []; // Non-auth errors or successful empty list
        })
      ]);

      setAnalyses(Array.isArray(analysesData) ? analysesData : []);
      const validPets = Array.isArray(petsData) ? petsData : [];
      setPets(validPets);

      if (validPets.length > 0) {
        setSelectedPetId(validPets[0].id);
      } else {
        setSelectedPetId("general"); // Default to general if no pets
      }

    } catch (error) {
      console.error("Error loading data:", error);
      
      // Update authentication state regardless of error type
      setIsAuthenticated(false);
      setUser(null);

      // Handle authentication errors. This function might redirect.
      if (handleAuthError(error)) {
        // If handleAuthError returns true, it means it handled the error (e.g., redirected to login)
        return; 
      }
      
      // If not an auth error or not handled by handleAuthError (e.g., network error for data)
      setAnalyses([]);
      setPets([]);
      // Optionally set a friendly error message for the user for data loading errors
      // setAiError(getFriendlyErrorMessage(error, "Failed to load pet data. Please try again.")); 
    } finally {
      setIsCheckingAuth(false); // Initial auth check completed
      setIsLoading(false); // Data loading completed
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;

    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setAiError(null);
    setIsLoading(true); // This isLoading is specifically for the AI query

    try {
      let prompt;
      const effectiveSelectedPet = pets.find((p) => p.id === selectedPetId);

      if (effectiveSelectedPet) {
        // Get comprehensive pet analyses
        const petAnalyses = Array.isArray(analyses)
          ? analyses.filter((a) => a.pet_id === effectiveSelectedPet.id).slice(0, 20)
          : [];

        // Calculate pet's age if birthday is available
        let ageInfo = "";
        if (effectiveSelectedPet.birthday) {
          try {
            const birthDate = new Date(effectiveSelectedPet.birthday);
            const today = new Date();
            let years = today.getFullYear() - birthDate.getFullYear();
            let months = today.getMonth() - birthDate.getMonth();
            
            if (months < 0) {
              years--;
              months += 12;
            }
            
            if (years > 0) {
              ageInfo = `${years} year${years > 1 ? 's' : ''}`;
              if (months > 0) {
                ageInfo += ` and ${months} month${months > 1 ? 's' : ''}`;
              }
            } else if (months > 0) {
              ageInfo = `${months} month${months > 1 ? 's' : ''}`;
            } else if (today.getTime() - birthDate.getTime() > 0) { // Check if birthdate is in the past
              ageInfo = "less than 1 month old";
            } else {
              ageInfo = "not yet born or invalid date"; // Future date or invalid
            }
          } catch (error) {
            console.error("Error calculating age:", error);
            ageInfo = ""; // Reset ageInfo if calculation fails
          }
        }

        // Build comprehensive pet profile
        let petProfile = `Pet Profile:
- Name: ${effectiveSelectedPet.name}
- Species: ${effectiveSelectedPet.species}`;

        if (effectiveSelectedPet.breed) {
          petProfile += `\n- Breed: ${effectiveSelectedPet.breed}`;
        }
        
        if (ageInfo) {
          petProfile += `\n- Age: ${ageInfo}`;
        }
        
        if (effectiveSelectedPet.gender && effectiveSelectedPet.gender !== 'unknown' && effectiveSelectedPet.gender !== 'not_specified') {
          petProfile += `\n- Gender: ${effectiveSelectedPet.gender}`;
        }
        
        if (effectiveSelectedPet.photo_url) {
          petProfile += `\n- Has profile photo on file`;
        }

        // Analyze behavioral patterns from history
        let behavioralInsights = "";
        if (petAnalyses.length > 0) {
          // Most common emotions
          const emotionCounts = {};
          petAnalyses.forEach(a => {
            if (a.emotion_detected) {
              const emotion = a.emotion_detected.toLowerCase();
              emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
            }
          });
          
          const topEmotions = Object.entries(emotionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([emotion, count]) => `${emotion} (${count} times)`);
          
          if (topEmotions.length > 0) {
            behavioralInsights += `\n\nMost Common Emotions Observed: ${topEmotions.join(', ')}`;
          }
          
          // Average confidence
          const validConfidences = petAnalyses.map(a => Number(a.confidence_level)).filter(c => !isNaN(c));
          if (validConfidences.length > 0) {
            const avgConfidence = Math.round(
              validConfidences.reduce((sum, val) => sum + val, 0) / validConfidences.length
            );
            behavioralInsights += `\nAverage Analysis Confidence: ${avgConfidence}%`;
          }
          
          // Recent behavioral summary
          behavioralInsights += `\n\nRecent Behavior History (last ${Math.min(petAnalyses.length, 20)} analyses):`;
          petAnalyses.slice(0, 10).forEach((a, idx) => {
            try {
              const date = new Date(a.created_date).toLocaleDateString();
              behavioralInsights += `\n${idx + 1}. ${date} - ${a.emotion_detected}: ${a.behavior_summary}`;
            } catch (dateError) {
              console.error("Error parsing analysis date:", dateError);
              behavioralInsights += `\n${idx + 1}. (Date Unknown) - ${a.emotion_detected}: ${a.behavior_summary}`;
            }
          });
        }

        prompt = `You are an expert pet behaviorist with years of experience. You have access to detailed information about ${effectiveSelectedPet.name}.

${petProfile}
${behavioralInsights}

Owner's question: "${userMessage.content}"

Provide a helpful, professional, and empathetic answer based on:
1. ${effectiveSelectedPet.name}'s specific profile (age, breed, species, gender if available)
2. ${effectiveSelectedPet.name}'s documented behavioral history and patterns
3. General pet behavior knowledge and best practices
4. Breed-specific behaviors ${effectiveSelectedPet.breed ? `for ${effectiveSelectedPet.breed}` : ''}

Important guidelines:
- Reference ${effectiveSelectedPet.name}'s actual behavior patterns from the history above (e.g., "Based on ${effectiveSelectedPet.name}'s history of [emotion]...")
- Be specific and personalized to ${effectiveSelectedPet.name}
- If you notice trends or patterns in the history, mention them (e.g., "It seems ${effectiveSelectedPet.name} frequently experiences [emotion] when...")
- Keep your response concise (2-3 paragraphs) but informative
- Always remind owners that this is educational guidance, not veterinary advice

Your answer:`;
      } else {
        // General question without specific pet selected
        const generalPetsContext = pets.length > 0
          ? `The user has the following pets: ${JSON.stringify(pets.map(p => {
              let pAgeInfo = 'unknown';
              if (p.birthday) {
                try {
                  const birthDate = new Date(p.birthday);
                  const today = new Date();
                  let years = today.getFullYear() - birthDate.getFullYear();
                  let months = today.getMonth() - birthDate.getMonth();
                  if (months < 0) {
                    years--;
                    months += 12;
                  }
                  if (years > 0) {
                    pAgeInfo = `${years}y`;
                    if (months > 0) pAgeInfo += ` ${months}m`;
                  } else if (months > 0) {
                    pAgeInfo = `${months}m`;
                  } else if (today.getTime() - birthDate.getTime() > 0) {
                    pAgeInfo = '<1m';
                  }
                } catch {}
              }
              return {
                name: p.name,
                species: p.species,
                breed: p.breed,
                age: pAgeInfo
              };
            }))}.`
          : `The user has not registered any pets yet.`;

        const generalAnalysesContext = analyses.length > 0
          ? `Some recent behavior analyses from the user's pets include: ${JSON.stringify(analyses.slice(0, 10).map(a => ({
              emotion: a.emotion_detected,
              summary: a.behavior_summary,
              date: new Date(a.created_date).toLocaleDateString()
            })))}.`
          : `No recent analyses available.`;

        prompt = `You are a friendly pet behavior expert assistant. ${generalPetsContext} ${generalAnalysesContext}

User question: "${userMessage.content}"

Provide a helpful, conversational response. Be warm, supportive, and provide actionable advice. If the question relates to a specific pet and the user has multiple pets, suggest they select a specific pet from the dropdown for more personalized advice. Keep responses concise (2-3 paragraphs max). Always remind owners that this is educational guidance, not veterinary advice.`;
      }

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: false,
      });

      const aiMessage = {
        role: "assistant",
        content: typeof response === "string" ? response : response.content || "I'm here to help with any questions about your pet's behavior!",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Use getFriendlyErrorMessage for AI response errors
      setAiError(getFriendlyErrorMessage(error, "I'm sorry, I had trouble processing that. Could you try rephrasing your question?"));
      const errorMessage = {
        role: "assistant",
        content: getFriendlyErrorMessage(error, "I'm sorry, I had trouble processing that. Could you try rephrasing your question?"),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // AI query completed
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const suggestedQuestions = [
    "How can I tell if my pet is stressed?",
    "What does it mean when my dog wags its tail slowly?",
    "Why is my cat meowing more than usual?",
    "How much exercise does my pet need daily?",
    "What are signs of separation anxiety?"
  ];

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEO
          title="Ask AI Expert | Pet Decoder AI"
          description="Get expert AI-powered answers to your pet behavior questions."
          noIndex={true}
        />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm max-w-md w-full">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                Sign In Required
              </h2>
              <p className="text-gray-600 mb-8">
                Please sign in to ask our AI expert questions about your pet's behavior
              </p>
              <Button
                onClick={() => User.login()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Ask AI Expert - Get Pet Behavior Insights | Pet Decoder AI"
        description="Ask our AI expert any questions about your pet's behavior and get instant, personalized answers based on your pet's history."
        noIndex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Ask Pet AI
                </h1>
                <p className="text-gray-600">Get instant answers about your pet's behavior</p>
              </div>
            </div>

            {pets.length > 0 && (
              <div className="mb-6">
                <label htmlFor="select-pet" className="block text-sm font-medium text-gray-700 mb-2">
                  Select a pet for personalized advice:
                </label>
                <Select
                  value={selectedPetId || "general"}
                  onValueChange={(value) => setSelectedPetId(value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="select-pet" className="w-full md:w-[200px] border-purple-200 focus:ring-purple-500">
                    <SelectValue placeholder="General Question" />
                  </SelectTrigger>
                  <SelectContent>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species})
                      </SelectItem>
                    ))}
                    <SelectItem value="general">General Question</SelectItem>
                  </SelectContent>
                </Select>
                {selectedPetId === 'general' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Your question will be answered using general pet knowledge. Select a pet above for personalized advice.
                  </p>
                )}
              </div>
            )}

            {aiError && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{aiError}</AlertDescription>
              </Alert>
            )}
          </motion.div>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardContent className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2">Ask me anything!</h3>
                  <p className="text-gray-600 mb-6">
                    I'm here to help you understand your pet's behavior better
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Try asking:</p>
                    {suggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="block mx-auto text-left border-purple-200 hover:bg-purple-50"
                        onClick={() => setQuestion(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-xl ${
                          msg.role === 'user' 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-4 rounded-xl">
                        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Ask about your pet's behavior..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[60px] resize-none border-purple-200 focus:border-purple-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleAsk}
                  disabled={isLoading || !question.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Be specific about what you're observing for better advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
