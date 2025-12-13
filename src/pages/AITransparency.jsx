
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle, AlertTriangle, Shield, Lock, Info } from "lucide-react";
import SEO from "../components/common/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function AITransparency() {
  return (
    <>
      <SEO
        title="AI Transparency - How Our Technology Works | Pet Decoder AI"
        description="Learn how Pet Decoder AI's artificial intelligence analyzes pet behavior. Understand our AI models, accuracy, limitations, and ethical approach."
        keywords="AI transparency, pet AI technology, machine learning pets, AI ethics, computer vision pets"
        canonicalUrl="https://yourapp.base44.com/ai-transparency"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-purple-100">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-600" />
                <div>
                  <CardTitle className="text-3xl">AI Ethics & Transparency</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Understanding Our AI System</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. AI System Overview</h2>
                <p>
                  Pet Decoder AI uses artificial intelligence (AI) to analyze visual content (photos and videos) of pets and provide behavioral insights. This document explains how our AI works, its limitations, and our ethical commitments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. How Our AI Works</h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-2">Input Processing</h3>
                    <p className="text-blue-800">
                      When you upload a photo or video (max 2 minutes), our system extracts key frames adaptively based on video length (3-20 frames) and sends them to advanced AI vision models capable of identifying animals, body language, and environmental context.
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-purple-900 mb-2">Analysis & Interpretation</h3>
                    <p className="text-purple-800">
                      Our AI analyzes visual cues including:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-purple-800">
                      <li>Body posture and positioning</li>
                      <li>Facial expressions and ear positions</li>
                      <li>Tail position and movement patterns</li>
                      <li>Environmental context</li>
                      <li>Comparative behavior patterns</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <h3 className="font-semibold text-green-900 mb-2">Output Generation</h3>
                    <p className="text-green-800">
                      The AI generates structured insights including emotion detection, behavior summary, possible reasons, and practical recommendations based on established pet psychology principles.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. AI Model Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-purple-200 p-4 rounded-xl">
                    <p className="font-semibold mb-2">Model Type:</p>
                    <p>Large Language Model with Vision Capabilities (Multi-modal AI)</p>
                  </div>
                  <div className="border-2 border-purple-200 p-4 rounded-xl">
                    <p className="font-semibold mb-2">Primary Function:</p>
                    <p>Computer Vision + Behavioral Interpretation</p>
                  </div>
                  <div className="border-2 border-purple-200 p-4 rounded-xl">
                    <p className="font-semibold mb-2">Supported Species:</p>
                    <p>Dogs and Cats (initially)</p>
                  </div>
                  <div className="border-2 border-purple-200 p-4 rounded-xl">
                    <p className="font-semibold mb-2">Processing Location:</p>
                    <p>Third-party AI API (cloud-based)</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Data Sources & Training</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p>
                      <strong>Pre-trained Models:</strong> We use commercially available AI models trained on publicly available datasets.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p>
                      <strong>No Training on User Data:</strong> Your uploaded photos and videos are NOT used to train or improve our AI models without explicit consent.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <p>
                      <strong>Expert Knowledge:</strong> AI prompts are designed with input from pet behavior research and veterinary science.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. AI Limitations & Risks</h2>
                <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-xl space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-amber-900">Not 100% Accurate</p>
                      <p className="text-amber-800">AI interpretations may contain errors. Confidence scores indicate reliability but are not guarantees.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-amber-900">Context Limitations</p>
                      <p className="text-amber-800">AI cannot understand full context beyond what's visible in images. Off-camera factors may affect behavior.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-amber-900">Not Medical Advice</p>
                      <p className="text-amber-800">AI cannot diagnose medical conditions or replace veterinary consultation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-amber-900">Breed & Individual Variation</p>
                      <p className="text-amber-800">Different breeds and individual pets may express emotions differently. AI uses generalized patterns.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Human Oversight</h2>
                <p>
                  <strong>Automated Processing:</strong> AI analysis is fully automated with no human review of individual analyses.
                </p>
                <p className="mt-2">
                  <strong>Quality Monitoring:</strong> We periodically review aggregate system performance and user feedback to improve prompts and accuracy.
                </p>
                <p className="mt-2">
                  <strong>User Reporting:</strong> Users can report inaccurate results, which helps us identify system issues.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  <Shield className="w-7 h-7 text-purple-600" />
                  7. Data Usage and Privacy
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Your Data is Never Used for AI Training
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      When you upload a photo or video for analysis, your media is processed by our AI to provide insights about your pet's behavior. However:
                    </p>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Your uploads are <strong>never used</strong> to train or improve our AI models</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Your data is <strong>never sold</strong> or shared with third parties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">Media files are analyzed only for <strong>your immediate results</strong></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">You maintain <strong>full ownership</strong> of all your data</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      How AI Processing Works
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed mb-3">
                      Our AI analysis uses computer vision technology provided by third-party AI services. Here's what happens:
                    </p>
                    <ol className="list-decimal ml-6 space-y-2 text-blue-800 text-sm">
                      <li>Your media is securely uploaded to our encrypted storage</li>
                      <li>The media is temporarily sent to the AI provider for analysis</li>
                      <li>The AI provider processes the media and returns behavioral insights</li>
                      <li>The AI provider does not store, retain, or use your media beyond this single analysis request</li>
                      <li>Results are saved to your account; original media remains under your control</li>
                    </ol>
                    <p className="text-blue-800 text-sm mt-3 font-semibold">
                      Important: While we use contractual agreements with AI providers to prevent data retention, we cannot guarantee their internal data handling practices beyond what is stated in their terms of service. For complete privacy assurance, consider this when uploading sensitive content.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Questions or Concerns?</h2>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <p className="text-gray-700 mb-4">
                    If you have questions about our AI system, data usage, or want to report an issue:
                  </p>
                  <div className="space-y-3">
                    <Link to={createPageUrl("Contact")}>
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        Contact Us
                      </Button>
                    </Link>
                    <Link to={createPageUrl("PrivacyPolicy")}>
                      <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-100">
                        Read Privacy Policy
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Regulatory Compliance</h2>
                <p className="mb-2">Our AI system is designed to comply with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>EU AI Act:</strong> Transparency requirements for AI systems</li>
                  <li><strong>Canada AIDA:</strong> Artificial Intelligence and Data Act (proposed)</li>
                  <li><strong>US AI Bill of Rights:</strong> Voluntary principles for safe AI</li>
                  <li><strong>GDPR Article 22:</strong> Automated decision-making transparency</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Future Improvements</h2>
                <p>
                  We continuously work to improve our AI system through:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Regular prompt optimization and refinement</li>
                  <li>Expanding species and breed coverage</li>
                  <li>Improving accuracy and confidence scoring</li>
                  <li>Adding explainability features</li>
                  <li>Incorporating user feedback</li>
                </ul>
              </section>

              <section className="bg-purple-50 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">AI System Card Summary</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold">Purpose:</p>
                    <p>Pet behavior interpretation</p>
                  </div>
                  <div>
                    <p className="font-semibold">Risk Level:</p>
                    <p>Low (informational use only)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Accuracy:</p>
                    <p>Variable (60-90% based on image quality)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Last Updated:</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
