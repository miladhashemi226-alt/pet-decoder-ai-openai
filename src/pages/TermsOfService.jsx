
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail } from "lucide-react";
import SEO from "../components/common/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TermsOfService() {
  return (
    <>
      <SEO
        title="Terms of Service - Pet Decoder AI"
        description="Read our terms of service to understand your rights and responsibilities when using Pet Decoder AI's pet behavior analysis platform."
        keywords="terms of service, user agreement, pet app terms, legal terms"
        canonicalUrl="https://yourapp.base44.com/terms-of-service"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-purple-100">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <CardTitle className="text-3xl">Terms of Service</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Pet Decoder AI ("the App," "our Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
                <p>
                  Pet Decoder AI is an AI-powered application that analyzes photos and videos (up to 2 minutes in length) of pets to provide behavioral insights, emotional interpretations, and care recommendations. The service uses artificial intelligence and machine learning technology.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. AI Insights Disclaimer</h2>
                <div className="bg-amber-50 border-2 border-amber-300 p-6 rounded-xl">
                  <p className="font-semibold text-amber-900 mb-2">⚠️ IMPORTANT DISCLAIMER</p>
                  <p>
                    This app uses artificial intelligence to interpret pet behavior and provide general insights. <strong>It is NOT a substitute for professional veterinary diagnosis, medical advice, or treatment.</strong>
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-2">
                    <li>AI analysis may contain errors or inaccuracies</li>
                    <li>Results are educational and informational only</li>
                    <li>Always consult a licensed veterinarian for health concerns</li>
                    <li>Do not rely solely on AI insights for critical decisions</li>
                    <li>We are not responsible for actions taken based on AI recommendations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. User Responsibilities</h2>
                <p className="mb-2">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate account information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Upload only content you own or have permission to use</li>
                  <li>Ensure uploaded videos do not exceed a maximum length of 2 minutes (120 seconds)</li>
                  <li>Not upload content depicting animal abuse or illegal activities</li>
                  <li>Not upload content containing identifiable humans without consent</li>
                  <li>Not use the service for commercial purposes without authorization</li>
                  <li>Not attempt to reverse-engineer or exploit the AI system</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Content Ownership and License</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Your Content</h3>
                <p>
                  You retain full ownership of all photos, videos, and content you upload ("Your Content"). By uploading, you grant us a limited, non-exclusive license to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Process and analyze Your Content using AI, which includes extracting individual frames from uploaded videos for analysis</li>
                  <li>Store Your Content on secure servers</li>
                  <li>Display Your Content back to you within the App</li>
                </ul>
                <p className="mt-3">
                  We will NOT use Your Content (including any extracted frames) for AI training, marketing, or public display without your explicit written consent.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">5.2 Our Content</h3>
                <p>
                  All AI analysis results, app design, code, and branding remain our intellectual property.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Prohibited Activities</h2>
                <p className="mb-2">You may NOT:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload illegal, abusive, or offensive content</li>
                  <li>Attempt to hack, disrupt, or compromise the service</li>
                  <li>Use automated scripts or bots to access the service</li>
                  <li>Resell or redistribute our services</li>
                  <li>Impersonate others or create fake accounts</li>
                  <li>Violate any person's privacy or intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Inaccurate or incorrect AI interpretations</li>
                  <li>Decisions made based on AI insights</li>
                  <li>Loss of data due to technical failures</li>
                  <li>Indirect, incidental, or consequential damages</li>
                  <li>Harm to pets resulting from reliance on the App</li>
                </ul>
                <p className="mt-3">
                  Our total liability shall not exceed the amount you paid for the service in the past 12 months, or $100 USD, whichever is greater.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Privacy and Data Use</h2>
                <p>
                  Your use of the App is subject to our Privacy Policy, which is incorporated by reference into these Terms. Please review it carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Account Termination</h2>
                <p className="mb-2">We reserve the right to suspend or terminate your account if:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You violate these Terms</li>
                  <li>You engage in abusive or illegal behavior</li>
                  <li>Your account is inactive for over 2 years</li>
                </ul>
                <p className="mt-3">
                  You may delete your account at any time from the Settings page. Upon deletion, all your data will be permanently removed within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Modifications to Service</h2>
                <p>
                  We reserve the right to modify, suspend, or discontinue any feature of the App at any time with or without notice. We are not liable for any modification or discontinuation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Dispute Resolution and Governing Law</h2>
                <p>
                  <strong>Governing Law:</strong> These Terms shall be governed by the laws of [Your Country/State].
                </p>
                <p className="mt-2">
                  <strong>Dispute Resolution:</strong> Any disputes shall first be resolved through good-faith negotiation. If unresolved, disputes shall be settled through binding arbitration in accordance with [Arbitration Rules].
                </p>
                <p className="mt-2">
                  <strong>EU Users:</strong> Nothing in these Terms affects your statutory rights under EU consumer protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Updates to Terms</h2>
                <p>
                  We may update these Terms from time to time. Significant changes will be notified via email or in-app notification at least 30 days before taking effect. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Contact Information</h2>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <p className="mb-4 text-gray-700">For questions about these Terms:</p>
                  <div className="space-y-4">
                    <div>
                      <Link
                        to={createPageUrl("Contact")}
                        className="inline-flex items-center gap-2 text-purple-600 hover:underline font-semibold text-lg"
                      >
                        <Mail className="w-5 h-5" />
                        Contact Us via Form
                      </Link>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Mailing Address:</p>
                      <div className="text-gray-700">
                        <p className="font-semibold">Pet Decoder AI Inc.</p>
                        <p>287-2967 Dundas St. W.</p>
                        <p>Toronto, Ontario M6P 1Z2</p>
                        <p>Canada</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Severability</h2>
                <p>
                  If any provision of these Terms is found to be unenforceable, the remaining provisions shall remain in full effect.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
