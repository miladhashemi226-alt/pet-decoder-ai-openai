
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, ArrowLeft, PawPrint, LogIn, TrendingUp, History, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import VideoUploader from "../components/analyze/VideoUploader";
import PetSelector from "../components/analyze/PetSelector";
import AnalysisResults from "../components/analyze/AnalysisResults";
import ConsentBanner from "../components/analyze/ConsentBanner";
import ContextualInfoForm from "../components/analyze/ContextualInfoForm";
import ProgressIndicator from "../components/common/ProgressIndicator";
import SEO from "../components/common/SEO";
import { handleAuthError, getFriendlyErrorMessage } from "../components/utils/errorHandler";
import {
  isValidFileType,
  isValidFileSize,
  getVideoDuration,
  MIN_VIDEO_DURATION_SECONDS,
  MAX_VIDEO_DURATION_SECONDS
} from "../components/utils/validation";
import { retryWithBackoff } from "../components/utils/retryLogic";
import { sendBehaviorAlertEmail } from "../components/utils/emailNotifications";

const ANALYSIS_STEPS = [
  { label: "Uploading media...", completed: false, current: false },
  { label: "Processing media...", completed: false, current: false },
  { label: "AI analyzing behavior...", completed: false, current: false },
  { label: "Generating insights...", completed: false, current: false }
];

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 3;

export default function Analyze() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [pets, setPets] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showConsent, setShowConsent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showContextForm, setShowContextForm] = useState(false);
  const [contextualInfo, setContextualInfo] = useState({
    whatHappened: "",
    concernedAbout: "",
    petReactivity: ""
  });
  const [steps, setSteps] = useState(ANALYSIS_STEPS); // Initializing with the constant array
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [guestAnalysisUsed, setGuestAnalysisUsed] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remainingRequests: MAX_REQUESTS_PER_WINDOW,
    resetTime: null
  });
  const [showWrongPetDialog, setShowWrongPetDialog] = useState(false);
  const [wrongPetInfo, setWrongPetInfo] = useState(null);

  useEffect(() => {
    loadData();
    checkConsent();
    checkGuestAnalysisLimit();
  }, []);

  useEffect(() => {
    return () => {
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  useEffect(() => {
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkConsent = () => {
    const consent = localStorage.getItem("video_analysis_consent");
    if (!consent) {
      setShowConsent(true);
    }
  };

  const checkGuestAnalysisLimit = () => {
    try {
      const used = localStorage.getItem("guest_analysis_used");
      if (used === "true") {
        setGuestAnalysisUsed(true);
      }
    } catch (error) {
      console.error("Error checking guest analysis limit:", error);
    }
  };

  const checkRateLimit = () => {
    const rateLimitData = JSON.parse(localStorage.getItem('analyze_rate_limit') || '{"requests": [], "resetTime": null}');
    const now = Date.now();
    
    const recentRequests = rateLimitData.requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
    
    const remainingRequests = Math.max(0, MAX_REQUESTS_PER_WINDOW - recentRequests.length);
    const oldestRequest = recentRequests[0];
    const resetTime = oldestRequest ? new Date(oldestRequest + RATE_LIMIT_WINDOW_MS) : null;
    
    setRateLimitInfo({ remainingRequests, resetTime });
    
    localStorage.setItem('analyze_rate_limit', JSON.stringify({
      requests: recentRequests,
      resetTime: resetTime ? resetTime.toISOString() : null
    }));
  };

  const recordRequest = () => {
    const rateLimitData = JSON.parse(localStorage.getItem('analyze_rate_limit') || '{"requests": []}');
    const now = Date.now();
    rateLimitData.requests.push(now);
    localStorage.setItem('analyze_rate_limit', JSON.stringify(rateLimitData));
    checkRateLimit();
  };

  const isRateLimited = () => {
    return rateLimitInfo.remainingRequests <= 0;
  };

  const getRateLimitMessage = () => {
    if (!rateLimitInfo.resetTime) return "";
    const secondsLeft = Math.ceil((rateLimitInfo.resetTime - Date.now()) / 1000);
    return `Please wait ${secondsLeft} seconds before analyzing again.`;
  };

  const loadData = async () => {
    setIsLoadingUser(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser) {
        const petsData = await base44.entities.Pet.list();
        setPets(petsData);
        if (petsData.length > 0) {
          setSelectedPet(petsData[0].id);
        } else {
          setSelectedPet(null);
        }
      } else {
        setPets([]);
        setSelectedPet(null);
      }
    } catch (error) {
      console.log("User not authenticated - allowing guest access", error);
      setUser(null);
      setPets([]);
      setSelectedPet(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleFileSelect = async (file) => {
    setError(null);
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    try {
      if (!isValidFileType(file)) {
        setError("Please upload a valid image (JPG, PNG) or video (MP4, MOV, AVI, WebM) file.");
        return;
      }

      if (!isValidFileSize(file)) {
        setError("File size must be less than 100MB.");
        return;
      }

      if (file.type.startsWith('video/')) {
        try {
          const duration = await getVideoDuration(file);

          if (duration < MIN_VIDEO_DURATION_SECONDS) {
            setError(`Video must be at least ${MIN_VIDEO_DURATION_SECONDS} second long.`);
            return;
          }

          if (duration > MAX_VIDEO_DURATION_SECONDS) {
            setError(`Video must be less than ${MAX_VIDEO_DURATION_SECONDS / 60} minutes long (${MAX_VIDEO_DURATION_SECONDS} seconds). Your video is ${Math.round(duration)} seconds.`);
            return;
          }
        } catch (err) {
          console.error("Error validating video duration:", err);
          setError("Could not validate video duration. Please try a different video.");
          return;
        }
      }

      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }

      const preview = URL.createObjectURL(file);
      setSelectedFile({ file, preview });
    } catch (err) {
      console.error("Error selecting file:", err);
      setError("Failed to process file. Please try again.");
    }
  };

  const extractMultipleFramesFromVideo = async (videoFile, numFrames = 5) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const frames = [];
      let currentFrameIndex = 0;
      let videoURL = null;

      const cleanup = () => {
        try {
          video.pause();
          if (videoURL) {
            URL.revokeObjectURL(videoURL);
          }
          video.src = '';
          video.load();
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      };

      const captureFrame = async () => {
        try {
          if (!video.videoWidth || !video.videoHeight) {
            throw new Error("Invalid video dimensions");
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const blob = await new Promise((res, rej) => {
            canvas.toBlob((b) => {
              if (b) res(b);
              else rej(new Error("Failed to create blob"));
            }, 'image/jpeg', 0.85);
          });

          frames.push(blob);
          currentFrameIndex++;

          if (currentFrameIndex < numFrames) {
            const nextTime = (video.duration / (numFrames + 1)) * (currentFrameIndex + 1);
            video.currentTime = Math.min(nextTime, video.duration - 0.1);
          } else {
            cleanup();
            resolve(frames);
          }
        } catch (error) {
          cleanup();
          reject(error);
        }
      };

      video.onseeked = () => {
        captureFrame();
      };

      video.onloadedmetadata = () => {
        if (video.duration < MIN_VIDEO_DURATION_SECONDS) {
          cleanup();
          reject(new Error("Video is too short"));
          return;
        }
        video.currentTime = video.duration / (numFrames + 1);
      };

      video.onerror = () => {
        cleanup();
        reject(new Error('Failed to load video'));
      };

      try {
        videoURL = URL.createObjectURL(videoFile);
        video.src = videoURL;
      } catch (error) {
        cleanup();
        reject(error);
      }
    });
  };

  const updateStepStatus = (stepIndex, status) => {
    setSteps(prev => prev.map((step, idx) => ({
      ...step,
      completed: idx < stepIndex ? true : status === 'completed',
      current: idx === stepIndex && status === 'current'
    })));
  };

  const performAnalysis = async (skipPetCheck = false) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentStep(0);
    setProgress(0);
    setSteps(ANALYSIS_STEPS); // Reset steps to initial state

    try {
      recordRequest();

      const pet = user ? pets.find(p => p.id === selectedPet) : null;

      updateStepStatus(0, 'current');
      setProgress(10);
      
      const uploadResult = await retryWithBackoff(
        async () => {
          try {
            const result = await base44.integrations.Core.UploadFile({ file: selectedFile.file });
            if (!result || !result.file_url) throw new Error("Upload failed - no URL returned");
            return result;
          } catch (error) {
            if (error.message && (
              error.message.includes('DatabaseTimeout') || 
              error.message.includes('database timed out') ||
              error.message.includes('statusCode\': 544')
            )) {
              throw new Error('Database timeout - retrying...');
            }
            throw error;
          }
        },
        5,
        2000
      );

      const fileUrl = uploadResult.file_url;
      
      if (!fileUrl || typeof fileUrl !== 'string' || !fileUrl.startsWith('http')) {
        throw new Error("Invalid file URL received from upload");
      }
      
      updateStepStatus(0, 'completed');
      setProgress(25);

      updateStepStatus(1, 'current');
      let frameUrls = [];

      if (selectedFile.file.type.startsWith('video/')) {
        const frames = await extractMultipleFramesFromVideo(selectedFile.file, 5);
        setProgress(40);

        const uploadPromises = frames.map((frameBlob, idx) =>
          retryWithBackoff(
            async () => {
              try {
                const result = await base44.integrations.Core.UploadFile({ file: new File([frameBlob], `frame-${idx}.jpg`, { type: 'image/jpeg' }) });
                if (!result || !result.file_url) throw new Error("Frame upload failed");
                return result;
              } catch (error) {
                if (error.message && (
                  error.message.includes('DatabaseTimeout') || 
                  error.message.includes('database timed out') ||
                  error.message.includes('statusCode\': 544')
                )) {
                  throw new Error('Database timeout - retrying frame upload...');
                }
                throw error;
              }
            },
            4,
            1500
          )
        );

        const frameResults = await Promise.all(uploadPromises);
        frameUrls = frameResults.map(r => r.file_url);

        const invalidUrls = frameUrls.filter(url => !url || typeof url !== 'string' || !url.startsWith('http'));
        if (invalidUrls.length > 0) {
          throw new Error("Some frame URLs are invalid");
        }

        if (frameUrls.length === 0) {
          throw new Error("Failed to upload frames");
        }
      } else {
        frameUrls = [fileUrl];
      }

      updateStepStatus(1, 'completed');
      setProgress(55);

      updateStepStatus(2, 'current');

      const contextInfo = [
        contextualInfo.whatHappened && `Context: "${contextualInfo.whatHappened}"`,
        contextualInfo.concernedAbout && `Concerns: "${contextualInfo.concernedAbout}"`,
        contextualInfo.petReactivity && `Typical behavior: "${contextualInfo.petReactivity}"`
      ].filter(Boolean).join('\n');

      const prompt = skipPetCheck ? 
        `You are analyzing ${selectedFile.file.type.startsWith('video/') ? 'multiple frames from a video' : 'an image'} of a ${pet ? pet.species : 'pet'}.

${contextInfo ? `Additional context from owner:\n${contextInfo}\n` : ''}

Analyze the ${pet ? pet.species : 'pet'}'s behavior:
- Body language and posture
- Facial expressions and ear position
- Tail position and movement
- Overall demeanor and energy level
- Environment and context
- Interaction with other pets (if present)

Provide:
1. Primary Emotion/State
2. Behavioral Summary (3-4 sentences)
3. Detailed Analysis (6-10 sentences)
4. Possible Reasons (3-5)
5. Recommendations (3-5)

Respond in JSON format with: emotion_detected, confidence_level, behavior_summary, detailed_analysis, possible_reasons (array), recommendations (array).`
        :
        `You are analyzing ${selectedFile.file.type.startsWith('video/') ? 'multiple frames from a video' : 'an image'}.

EXPECTED PET: ${pet ? `${pet.name} - a ${pet.species}${pet.breed ? ` (${pet.breed})` : ''}${pet.gender ? `, ${pet.gender}` : ''}` : 'any pet (dog or cat)'}
${pet && pet.photo_url ? `The owner has uploaded a reference photo of ${pet.name}. Try to match visual characteristics if possible.` : ''}

${contextInfo ? `Additional context from owner:\n${contextInfo}\n` : ''}

CRITICAL - PET DETECTION & VERIFICATION:

Step 1: Check if ${pet ? `a ${pet.species}` : 'a pet (dog or cat)'} is visible.
- If NO ${pet ? pet.species : 'pet'} is visible at all → set pet_detected = false

Step 2: If a ${pet ? pet.species : 'pet'} IS visible, determine if it matches the expected pet:
${pet && pet.breed ? `- Expected breed: ${pet.breed}` : ''}
${pet && pet.gender ? `- Expected gender: ${pet.gender}` : ''}
${pet && pet.photo_url ? `- Reference photo provided: compare visual characteristics` : '- No reference photo available'}

Set "correct_pet_detected" based on:
- true: The ${pet ? pet.species : 'pet'} appears to match the expected characteristics (breed, gender, appearance)
- false: A ${pet ? pet.species : 'pet'} is visible BUT appears to be a different individual (different breed, markings, size, etc.)
- If unsure or no reference photo, default to true

Respond in this JSON format:
{
  "pet_detected": boolean,
  "correct_pet_detected": boolean,
  "detection_message": "string (explain what you see)",
  "emotion_detected": "string",
  "confidence_level": number 0-100,
  "behavior_summary": "string",
  "detailed_analysis": "string",
  "possible_reasons": ["string"],
  "recommendations": ["string"]
}`;

      const analysisResponse = await retryWithBackoff(
        async () => {
          const result = await base44.integrations.Core.InvokeLLM({
            prompt,
            file_urls: frameUrls,
            response_json_schema: {
              type: "object",
              properties: {
                pet_detected: { type: "boolean" },
                correct_pet_detected: { type: "boolean" },
                detection_message: { type: "string" },
                behavior_summary: { type: "string" },
                emotion_detected: { type: "string" },
                confidence_level: { type: "number" },
                possible_reasons: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                detailed_analysis: { type: "string" }
              },
              required: skipPetCheck ? 
                ["emotion_detected", "confidence_level", "behavior_summary", "detailed_analysis", "possible_reasons", "recommendations"] :
                ["pet_detected", "correct_pet_detected", "detection_message", "emotion_detected", "confidence_level", "behavior_summary", "detailed_analysis", "possible_reasons", "recommendations"]
            }
          });
          
          if (!result || typeof result !== 'object') {
            throw new Error("AI analysis failed - invalid response");
          }
          
          return result;
        },
        3,
        2000
      );

      updateStepStatus(2, 'completed');
      setProgress(85);

      if (!skipPetCheck && analysisResponse.pet_detected === false) {
        updateStepStatus(3, 'completed');
        setProgress(100);
        setIsAnalyzing(false);
        
        const detectionMsg = analysisResponse.detection_message || "No pet was detected in the uploaded media.";
        setError(
          pet 
            ? `❌ No ${pet.species} detected in this media.\n\n${detectionMsg}\n\nPlease upload a clearer ${selectedFile.file.type.startsWith('video/') ? 'video' : 'photo'} showing a ${pet.species}.`
            : `❌ No pet detected in media.\n\n${detectionMsg}\n\nPlease upload a ${selectedFile.file.type.startsWith('video/') ? 'video' : 'photo'} that clearly shows your pet.`
        );
        return;
      }

      if (!skipPetCheck && pet && analysisResponse.pet_detected === true && analysisResponse.correct_pet_detected === false) {
        updateStepStatus(3, 'completed');
        setProgress(100);
        setIsAnalyzing(false);
        
        setWrongPetInfo({
          message: analysisResponse.detection_message,
          response: analysisResponse
        });
        setShowWrongPetDialog(true);
        return;
      }

      updateStepStatus(3, 'current');

      const validatedAnalysisResponse = {
        emotion_detected: analysisResponse.emotion_detected || "Neutral",
        confidence_level: (() => {
          let confidence = typeof analysisResponse.confidence_level === 'number' ? analysisResponse.confidence_level : 50;
          // If AI returns 0-1 scale, convert to percentage
          if (confidence > 0 && confidence < 1) {
            confidence = confidence * 100;
          }
          // Ensure it's between 0-100
          return Math.max(0, Math.min(100, Math.round(confidence)));
        })(),
        behavior_summary: analysisResponse.behavior_summary || "No specific behavior observed.",
        detailed_analysis: analysisResponse.detailed_analysis || "No detailed analysis provided.",
        possible_reasons: Array.isArray(analysisResponse.possible_reasons) && analysisResponse.possible_reasons.length > 0 ? analysisResponse.possible_reasons : ["General pet behavior."],
        recommendations: Array.isArray(analysisResponse.recommendations) && analysisResponse.recommendations.length > 0 ? analysisResponse.recommendations : ["Continue observing your pet."],
      };

      if (!user) {
        try {
          localStorage.setItem("guest_analysis_used", "true");
          setGuestAnalysisUsed(true);
        } catch (error) {
          console.error("Error setting guest analysis limit:", error);
        }
      }

      if (user && selectedPet) {
        try {
          const analysisData = {
            pet_id: selectedPet,
            video_url: fileUrl,
            emotion_detected: validatedAnalysisResponse.emotion_detected,
            confidence_level: validatedAnalysisResponse.confidence_level,
            behavior_summary: validatedAnalysisResponse.behavior_summary,
            detailed_analysis: validatedAnalysisResponse.detailed_analysis,
            possible_reasons: validatedAnalysisResponse.possible_reasons,
            recommendations: validatedAnalysisResponse.recommendations,
            audio_analyzed: false
          };

          const savedAnalysis = await base44.entities.Analysis.create(analysisData);
          updateStepStatus(3, 'completed');
          setProgress(100);

          setAnalysisResult({
            ...validatedAnalysisResponse,
            media_url: selectedFile.preview,
            analysis_id: savedAnalysis.id,
            pet: pet
          });

          // Send behavior alert email if concerning emotion detected
          const concerningEmotions = ['anxious', 'anxiety', 'stress', 'stressed', 'fearful', 'fear', 'aggressive', 'aggression', 'distressed', 'panic'];
          const emotionLower = validatedAnalysisResponse.emotion_detected.toLowerCase();
          
          if (concerningEmotions.some(emotion => emotionLower.includes(emotion))) {
            try {
              const emailResult = await sendBehaviorAlertEmail(user, pet, {
                ...validatedAnalysisResponse,
                id: savedAnalysis.id
              });
              
              if (emailResult && emailResult.sent) {
                console.log('Behavior alert email sent successfully');
              } else if (emailResult && emailResult.skipped) {
                console.log('Behavior alert email skipped:', emailResult.reason);
              }
            } catch (emailError) {
              console.error('Failed to send behavior alert email:', emailError);
              // Don't block the analysis if email fails
            }
          }
        } catch (saveError) {
          console.error("Failed to save analysis:", saveError);
          updateStepStatus(3, 'completed');
          setProgress(100);
          
          setAnalysisResult({
            ...validatedAnalysisResponse,
            media_url: selectedFile.preview,
            analysis_id: null,
            pet: pet
          });
        }
      } else {
        updateStepStatus(3, 'completed');
        setProgress(100);
        
        setAnalysisResult({
          ...validatedAnalysisResponse,
          media_url: selectedFile.preview,
          analysis_id: null,
          pet: null
        });
      }

    } catch (err) {
      console.error("Analysis error:", err);
      if (handleAuthError(err)) {
        return;
      }
      
      let errorMessage = getFriendlyErrorMessage(err);
      
      if (err.message && (
        err.message.includes('DatabaseTimeout') || 
        err.message.includes('database timed out') ||
        err.message.includes('statusCode\': 544')
      )) {
        errorMessage = "The server is experiencing high load. Please wait a moment and try again. If this persists, try uploading a smaller file.";
      }
      
      setError(errorMessage);
      setSteps(ANALYSIS_STEPS); // Reset steps on error
      setProgress(0);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!user && guestAnalysisUsed) {
      setError("You've used your free analysis! Sign in to continue analyzing your pet's behavior.");
      return;
    }

    if (!selectedFile || (user && !selectedPet)) {
      setError(user ? "Please select both a video/image and a pet." : "Please select a video/image.");
      return;
    }

    if (isRateLimited()) {
      setError(`Rate limit reached. ${getRateLimitMessage()}`);
      return;
    }

    await performAnalysis(false);
  };

  const handleContinueWithWrongPet = async () => {
    setShowWrongPetDialog(false);
    setWrongPetInfo(null);
    await performAnalysis(true);
  };

  const handleCancelWrongPet = () => {
    setShowWrongPetDialog(false);
    setWrongPetInfo(null);
    setError("Analysis cancelled. Please upload a photo of the correct pet.");
    setSteps(ANALYSIS_STEPS); // Reset steps on cancellation
    setProgress(0);
    setAnalysisResult(null);
  };

  const resetAnalysis = () => {
    if (selectedFile?.preview) {
      URL.revokeObjectURL(selectedFile.preview);
    }
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    setShowContextForm(false);
    setContextualInfo({
      whatHappened: "",
      concernedAbout: "",
      petReactivity: ""
    });
    setSteps(ANALYSIS_STEPS); // Reset steps on full reset
    setShowWrongPetDialog(false);
    setWrongPetInfo(null);
  };

  const handleConsentAccept = () => {
    localStorage.setItem("video_analysis_consent", "true");
    setShowConsent(false);
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8 flex items-center justify-center">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm p-8 text-center max-w-md">
          <CardContent className="p-0">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading user data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSelectedPet = user && pets.find(p => p.id === selectedPet);

  return (
    <>
      <SEO
        title="Analyze Pet Behavior - Upload Video | Pet Decoder AI"
        description="Upload a video or photo of your pet to get instant AI-powered behavior analysis."
        noIndex={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            {user && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(createPageUrl("Dashboard"))}
                className="hover:bg-purple-100 border-purple-200"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Analyze Pet Behavior
              </h1>
              <p className="text-gray-600">Upload a video or photo to understand your pet better</p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {showConsent ? (
              <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ConsentBanner onAccept={handleConsentAccept} />
              </motion.div>
            ) : analysisResult ? (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <AnalysisResults
                  result={analysisResult}
                  onReset={resetAnalysis}
                  user={user}
                  isAuthenticated={!!user}
                />
              </motion.div>
            ) : !user && guestAnalysisUsed ? (
              <motion.div
                key="signup-required"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 shadow-2xl">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <PawPrint className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Love the insights? Sign up to continue!
                    </h2>
                    <p className="text-xl text-gray-700 mb-6">
                      You've used your free analysis. Create an account to unlock:
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-8 text-left">
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Unlimited Analyses</h3>
                            <p className="text-sm text-gray-600">Analyze as many videos as you want</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
                            <p className="text-sm text-gray-600">Monitor behavior patterns over time</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <PawPrint className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Multiple Pets</h3>
                            <p className="text-sm text-gray-600">Add profiles for all your pets</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        <div className="flex items-start gap-3">
                          <History className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Full History</h3>
                            <p className="text-sm text-gray-600">Access all your past analyses</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        const currentUrl = window.location.href;
                        base44.auth.redirectToLogin(currentUrl);
                      }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-12 py-6 text-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      <LogIn className="w-6 h-6 mr-3" />
                      Sign Up with Google - It's Free!
                    </Button>
                    
                    <p className="text-sm text-gray-500 mt-6">
                      Free • No credit card required • Sign up in 10 seconds
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="upload-form"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {error && (
                  <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-5 w-5" />
                    <AlertDescription className="ml-2 whitespace-pre-line">{error}</AlertDescription>
                  </Alert>
                )}

                {!user && !guestAnalysisUsed && (
                  <Alert className="border-purple-200 bg-purple-50">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <AlertDescription className="ml-2 text-purple-900">
                      Try one analysis before signing up. Sign in for unlimited analyses and full features!
                    </AlertDescription>
                  </Alert>
                )}

                {user && pets.length === 0 ? (
                  <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                      <div className="text-6xl mb-4">🐾</div>
                      <h3 className="text-xl font-bold mb-2">No Pets Registered</h3>
                      <p className="text-gray-600 mb-6">
                        Add your pet's profile to get started
                      </p>
                      <Button
                        onClick={() => navigate(createPageUrl("PetProfile") + "?add=true")}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        Add Pet Profile
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <VideoUploader
                      videoFile={selectedFile?.file}
                      onVideoSelect={handleFileSelect}
                      onMediaSelect={handleFileSelect}
                      isAnalyzing={isAnalyzing}
                    />

                    {selectedFile && user && pets.length > 0 && (
                      <PetSelector
                        pets={pets}
                        selectedPet={selectedPet}
                        onSelectPet={setSelectedPet}
                      />
                    )}

                    {selectedFile && (
                      <ContextualInfoForm
                        contextualInfo={contextualInfo}
                        setContextualInfo={setContextualInfo}
                        showContextForm={showContextForm}
                        setShowContextForm={setShowContextForm}
                      />
                    )}

                    {isAnalyzing && (
                      <ProgressIndicator
                        steps={steps}
                        currentStep={currentStep}
                        progress={progress}
                      />
                    )}

                    <Button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || (user && !selectedPet) || isAnalyzing || isRateLimited()}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : isRateLimited() ? (
                        <>
                          <Clock className="w-5 h-5 mr-2" />
                          Rate Limit Reached
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Analyze Behavior
                        </>
                      )}
                    </Button>
                    {rateLimitInfo.remainingRequests < MAX_REQUESTS_PER_WINDOW && (
                      <div className={`text-sm text-center mt-2 ${isRateLimited() ? 'text-red-600' : 'text-gray-600'}`}>
                        {isRateLimited() ? (
                          <>{getRateLimitMessage()}</>
                        ) : (
                          <>{rateLimitInfo.remainingRequests} analysis {rateLimitInfo.remainingRequests === 1 ? 'remaining' : 'remaining'} this minute</>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wrong Pet Confirmation Dialog */}
          <AnimatePresence>
            {showWrongPetDialog && wrongPetInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={handleCancelWrongPet}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Different Pet Detected
                    </h3>
                    <p className="text-gray-600">
                      {wrongPetInfo.message || `This doesn't appear to be ${currentSelectedPet?.name}.`}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">
                      <strong>Would you like to continue analyzing anyway?</strong>
                      <br />
                      The AI detected a {currentSelectedPet?.species || 'pet'} in your media, but it may not be the pet you selected.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleContinueWithWrongPet}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Yes, Analyze This Pet
                    </Button>
                    <Button
                      onClick={handleCancelWrongPet}
                      variant="outline"
                      className="w-full py-6 border-gray-300"
                    >
                      Cancel & Upload Different Photo
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
