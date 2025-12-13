import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, TrendingUp, Target, CheckCircle, Clock, Sparkles, AlertTriangle } from "lucide-react";

export default function AIImprovementPlan() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            AI Analysis Improvement Plan
          </h1>
          <p className="text-gray-600">Comprehensive roadmap for enhancing behavioral analysis accuracy</p>
        </div>

        {/* Current System Overview */}
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-purple-100">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-600" />
              Current System Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-xl">
              <h3 className="font-bold text-blue-900 mb-2">How It Works Now:</h3>
              <ol className="list-decimal pl-6 space-y-2 text-blue-800">
                <li>Extract 3-20 frames from video (adaptive based on duration)</li>
                <li>Upload frames to cloud storage</li>
                <li>Send all frames + text prompt to Vision LLM (GPT-4 Vision or similar)</li>
                <li>LLM analyzes static frames and infers behavior patterns</li>
                <li>Return structured JSON with emotions, confidence, recommendations</li>
              </ol>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200 p-4 rounded-xl">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Current Limitations:
              </h3>
              <ul className="space-y-2 text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>No Motion Analysis:</strong> Tail wagging, body movement, gait patterns are inferred from static frames, not measured</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>No Temporal Context:</strong> Speed, duration, rhythm of behaviors cannot be accurately assessed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>No Audio:</strong> Vocalizations (barking, whining, purring, growling) are completely missed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Frame Quality Issues:</strong> Motion blur, poor lighting, occlusions reduce accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Limited Context:</strong> Can't see what pet is reacting to (off-camera stimuli)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* The Tail Wagging Problem */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 mb-8">
          <CardHeader className="border-b border-orange-200">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-orange-600" />
              The Tail Wagging Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700 leading-relaxed">
              <strong>Tail wagging is fundamentally a MOTION behavior</strong> - it cannot be fully understood from static frames alone. 
              Here's why it's challenging and how we can improve:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border-2 border-orange-200">
                <h4 className="font-bold text-orange-900 mb-2">What We Miss:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">▸</span>
                    <span><strong>Wag Speed:</strong> Fast wags = excitement, slow wags = uncertainty/caution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">▸</span>
                    <span><strong>Wag Direction:</strong> Right-biased = positive emotion, left-biased = negative/anxious</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">▸</span>
                    <span><strong>Wag Amplitude:</strong> Full body wags vs just tip of tail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">▸</span>
                    <span><strong>Wag Pattern:</strong> Continuous vs intermittent, rhythmic vs erratic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">▸</span>
                    <span><strong>Context:</strong> Wagging while approaching (friendly) vs backing away (fear)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                <h4 className="font-bold text-green-900 mb-2">What We Can Infer (Limited):</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Tail position in each frame (up, down, neutral)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Rough sequence of tail positions across frames</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>LLM can guess motion from multiple static frames</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500">⚠</span>
                    <span className="text-amber-700">But accuracy is limited - we're guessing, not measuring</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Phases */}
        <div className="space-y-6">
          {/* Phase 1: Immediate Improvements */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Phase 1: Immediate Improvements (0-2 weeks)
              </CardTitle>
              <Badge className="bg-white/20 text-white border-none mt-2">Can implement now with current infrastructure</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Enhanced Frame Selection Strategy</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Instead of evenly spaced frames, use intelligent sampling:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Extract frames at variable intervals to capture motion</li>
                      <li>• Include frames from beginning, middle, end + action moments</li>
                      <li>• Use scene change detection to identify key moments</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Temporal Sequence Prompting</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Improve prompts to explicitly reference frame sequence:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg mt-2 text-xs font-mono">
                      "You are analyzing a sequence of {'{'}n{'}'} frames from a video in chronological order.
                      Frame 1 shows the start, Frame {'{'}n{'}'} shows the end. Pay attention to how the pet's
                      body language, position, and movement CHANGE across frames. If you see the tail in
                      different positions across frames, estimate the speed and pattern of movement."
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Frame Metadata & Timestamps</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Label each frame with timestamp and sequence number:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• "Frame 1 (0.5s)", "Frame 2 (2.0s)", "Frame 3 (4.5s)"</li>
                      <li>• Helps LLM understand time gaps between frames</li>
                      <li>• Can calculate rough motion speed from position changes</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Motion-Specific Questions in Prompt</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Ask LLM to explicitly analyze motion:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg mt-2 text-xs font-mono">
                      "Specifically analyze: 1) Is the tail wagging? If yes, estimate speed (slow/medium/fast)
                      and pattern (wide/narrow, continuous/intermittent). 2) Is the pet moving toward or away
                      from something? 3) Are there body movements suggesting play, fear, or aggression?"
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Multi-Stage Analysis</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      First pass: Identify key frames with motion. Second pass: Deep analysis of those frames.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 mt-4">
                <h4 className="font-bold text-green-900 mb-2">Expected Impact:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• 15-25% improvement in motion-based behavior detection</li>
                  <li>• Better tail wagging, play behavior, and anxiety detection</li>
                  <li>• More accurate confidence scores</li>
                  <li>• Implementation cost: ~1-2 days of development</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Phase 2: Short-term Improvements */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Phase 2: Short-term Improvements (2-6 weeks)
              </CardTitle>
              <Badge className="bg-white/20 text-white border-none mt-2">Requires additional processing logic</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Frame Difference Analysis</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Calculate pixel differences between consecutive frames:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Compute frame-to-frame difference (simple subtraction)</li>
                      <li>• Identify regions with high motion (tail, body, head)</li>
                      <li>• Create "motion heatmap" showing where movement occurs</li>
                      <li>• Send heatmap + frames to LLM for enhanced analysis</li>
                    </ul>
                    <div className="bg-blue-50 p-3 rounded-lg mt-2 text-xs">
                      <strong>Tech:</strong> Use Canvas API or server-side image processing (Python/OpenCV)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Motion Magnitude Scoring</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Quantify how much motion occurs in each frame:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Calculate motion score: high = active/playful, low = calm/resting</li>
                      <li>• Identify "motion spikes" (sudden movements → startle, play)</li>
                      <li>• Track motion over time (increasing → building excitement)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Blur Detection & Quality Scoring</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Detect and handle motion blur:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Use Laplacian variance to detect blur</li>
                      <li>• Skip or deprioritize blurry frames</li>
                      <li>• Warn user if video quality is too low</li>
                      <li>• Extract more frames from high-quality segments</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Key Frame Detection</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Automatically identify most important frames:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Detect scene changes, sudden movements</li>
                      <li>• Identify frames with clear pet visibility</li>
                      <li>• Prioritize frames with facial expressions visible</li>
                      <li>• Ensure diverse sampling across video duration</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Structured Motion Annotations</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Add computed motion data to LLM prompt:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg mt-2 text-xs font-mono">
                      "Frame 1 (0.5s): Motion score: 8/10 (high), Motion region: tail + rear body
                      Frame 2 (2.0s): Motion score: 9/10 (very high), Motion region: full body
                      Frame 3 (4.5s): Motion score: 3/10 (low), Motion region: head only
                      
                      Based on motion data, the pet shows high activity in the first 2 seconds,
                      then becomes calmer. Tail region shows consistent high motion (likely wagging)."
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 mt-4">
                <h4 className="font-bold text-blue-900 mb-2">Expected Impact:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 30-40% improvement in motion behavior accuracy</li>
                  <li>• Reliable tail wagging detection (speed, intensity)</li>
                  <li>• Better play vs aggression differentiation</li>
                  <li>• Reduced false positives from poor quality videos</li>
                  <li>• Implementation cost: ~2-4 weeks (backend processing pipeline)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Phase 3: Medium-term Improvements */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Phase 3: Medium-term Improvements (2-4 months)
              </CardTitle>
              <Badge className="bg-white/20 text-white border-none mt-2">Requires specialized ML models & infrastructure</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Optical Flow Analysis</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Track motion vectors between frames:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Calculate dense optical flow (Farneback or Lucas-Kanade algorithms)</li>
                      <li>• Visualize motion direction and speed as vector field</li>
                      <li>• Detect circular motions (tail wagging), linear motions (walking), erratic motions (play)</li>
                      <li>• Measure motion frequency (wags per second)</li>
                    </ul>
                    <div className="bg-purple-50 p-3 rounded-lg mt-2 text-xs">
                      <strong>Tech:</strong> OpenCV optical flow, or MediaPipe for real-time processing
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Pet Pose Estimation</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Track skeletal keypoints frame-by-frame:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Detect nose, eyes, ears, shoulders, hips, paws, tail base, tail tip</li>
                      <li>• Track each keypoint's position across frames</li>
                      <li>• Calculate joint angles (tail angle, back arch, head tilt)</li>
                      <li>• Measure gait patterns, posture changes, body language</li>
                      <li>• Tail wagging: track tail tip movement speed, amplitude, frequency</li>
                    </ul>
                    <div className="bg-purple-50 p-3 rounded-lg mt-2 text-xs">
                      <strong>Tech:</strong> DeepLabCut, SLEAP, or fine-tuned MediaPipe for pets
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Audio Analysis Integration</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Extract and analyze audio from videos:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Detect vocalizations (barks, whines, growls, purrs, meows, hisses)</li>
                      <li>• Analyze pitch, volume, duration, frequency</li>
                      <li>• Correlate audio events with visual behavior</li>
                      <li>• Detect stress vocalizations, pain sounds, excitement sounds</li>
                    </ul>
                    <div className="bg-purple-50 p-3 rounded-lg mt-2 text-xs">
                      <strong>Tech:</strong> Whisper for audio processing, custom audio classification model
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Temporal Convolutional Networks (TCN)</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Use specialized video understanding models:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Train or fine-tune models that understand temporal sequences</li>
                      <li>• Process entire video as a sequence, not independent frames</li>
                      <li>• Learn behavior patterns: "play bow", "zoomies", "stalking", "guarding"</li>
                      <li>• Recognize complex multi-stage behaviors</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Context Understanding</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Analyze environment and context:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Detect other pets, people, objects in frame</li>
                      <li>• Identify setting (home, park, vet, car)</li>
                      <li>• Track pet's focus/attention (what are they looking at?)</li>
                      <li>• Understand social interactions (with humans, other pets)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Breed-Specific Models</h4>
                    <p className="text-sm text-gray-700 mt-1">
                      Different breeds express emotions differently:
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 mt-1 space-y-1">
                      <li>• Tail position: Greyhounds curl tails, Huskies raise tails high</li>
                      <li>• Facial expressions: Flat-faced breeds (Pugs) harder to read</li>
                      <li>• Body language: Herding breeds crouch/stalk, toy breeds hop/jump</li>
                      <li>• Train breed-specific behavior classifiers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200 mt-4">
                <h4 className="font-bold text-purple-900 mb-2">Expected Impact:</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• 60-80% improvement in behavioral accuracy</li>
                  <li>• Precise tail wagging metrics (speed, frequency, direction)</li>
                  <li>• Complex behavior recognition (play vs aggression, stalking, herding)</li>
                  <li>• Audio-visual multimodal analysis</li>
                  <li>• Breed-specific insights</li>
                  <li>• Implementation cost: 2-4 months + ML expertise</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Phase 4: Long-term Vision */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-7 h-7" />
                Phase 4: Long-term Vision (6-12 months)
              </CardTitle>
              <Badge className="bg-white/20 text-white border-none mt-2">Research-level capabilities</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3 text-white/90">
                <div>
                  <h4 className="font-bold text-white mb-2">🎯 Real-time Behavior Tracking</h4>
                  <p className="text-sm">Live analysis during video recording with instant feedback</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">🔮 Predictive Behavior Modeling</h4>
                  <p className="text-sm">Predict anxiety episodes, health issues based on behavioral trends</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">📊 Longitudinal Health Tracking</h4>
                  <p className="text-sm">Track behavioral changes over months/years for early disease detection</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">🤝 Multi-Pet Interaction Analysis</h4>
                  <p className="text-sm">Analyze social dynamics between multiple pets in same video</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">🎓 Continuous Learning</h4>
                  <p className="text-sm">Learn from user feedback, vet validations, community data</p>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-2">🔬 Research Partnerships</h4>
                  <p className="text-sm">Collaborate with veterinary behaviorists, universities for validation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Priority Matrix */}
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mt-8">
          <CardHeader className="border-b border-purple-100">
            <CardTitle>Recommended Implementation Priority</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-300">
                <h4 className="font-bold text-green-900 mb-3">🚀 Implement First (High Impact, Low Cost)</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-start gap-2">
                    <span>1.</span>
                    <span>Enhanced prompting with temporal sequence markers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>2.</span>
                    <span>Frame metadata and timestamps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>3.</span>
                    <span>Motion-specific questions in prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>4.</span>
                    <span>Blur detection and quality scoring</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-300">
                <h4 className="font-bold text-blue-900 mb-3">⚡ Implement Second (Medium Impact, Medium Cost)</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span>5.</span>
                    <span>Frame difference analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>6.</span>
                    <span>Motion magnitude scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>7.</span>
                    <span>Key frame detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>8.</span>
                    <span>Structured motion annotations</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-300">
                <h4 className="font-bold text-purple-900 mb-3">🔬 Research & Experiment (High Impact, High Cost)</h4>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span>9.</span>
                    <span>Optical flow analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>10.</span>
                    <span>Pet pose estimation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>11.</span>
                    <span>Audio analysis</span>
                  </li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-300">
                <h4 className="font-bold text-indigo-900 mb-3">🎯 Long-term Goals (Transformative, Major Investment)</h4>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li className="flex items-start gap-2">
                    <span>12.</span>
                    <span>TCN video understanding models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>13.</span>
                    <span>Real-time tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>14.</span>
                    <span>Predictive modeling</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Metrics */}
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mt-8">
          <CardHeader className="border-b border-purple-100">
            <CardTitle>Success Metrics & Validation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">How to Measure Improvement:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span><strong>User Feedback Score:</strong> Track thumbs up/down ratings on analyses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span><strong>Confidence Calibration:</strong> Check if 80% confidence predictions are actually correct 80% of the time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span><strong>Behavior Agreement:</strong> Compare AI predictions with expert veterinary behaviorist labels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span><strong>Tail Wagging Test Set:</strong> Create benchmark videos with known tail wag speeds/patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span><strong>User Retention:</strong> Do users come back to analyze more videos?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span><strong>Error Reports:</strong> Track "report inaccurate" submissions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-300">
                <h4 className="font-bold text-amber-900 mb-2">Validation Partnership Ideas:</h4>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li>• Partner with veterinary behaviorists to label dataset</li>
                  <li>• Run controlled study: AI predictions vs. human expert predictions</li>
                  <li>• Collaborate with dog trainers, shelter organizations</li>
                  <li>• Publish accuracy metrics transparently</li>
                  <li>• Create "certified accurate" badge for high-confidence analyses</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="border-none shadow-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white mt-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Next Steps</h3>
            <div className="space-y-3 text-white/90">
              <p>
                <strong>Week 1-2:</strong> Implement Phase 1 improvements (enhanced prompting, timestamps, motion questions)
              </p>
              <p>
                <strong>Week 3-6:</strong> Add frame difference analysis and motion magnitude scoring
              </p>
              <p>
                <strong>Month 2-3:</strong> Experiment with blur detection, key frame selection
              </p>
              <p>
                <strong>Month 3-4:</strong> Research optical flow and pose estimation - pilot test
              </p>
              <p>
                <strong>Ongoing:</strong> Collect user feedback, build validation dataset, measure accuracy improvements
              </p>
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-xl">
              <p className="text-sm">
                <strong>Key Insight:</strong> The biggest improvements come from combining multiple techniques. 
                Even Phase 1 + Phase 2 improvements (achievable in 6 weeks) can dramatically improve tail wagging 
                and motion-based behavior detection by giving the LLM better temporal context and motion data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}