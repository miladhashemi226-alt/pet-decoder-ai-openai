
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Mail } from "lucide-react";
import SEO from "../components/common/SEO";
// Link is no longer needed from react-router-dom for this file's specific usage
// as we are switching to <a> tags with href for general navigation/external links.
// If other parts of the file *not* modified here still need Link, it would remain.
// Given the outline, it seems the intention is to use <a> tags with the new createPageUrl
// and the original Link import for react-router-dom was removed from the outline.
// So, I'll remove it.
// import { Link } from "react-router-dom"; // Assuming react-router-dom for Link

import { createPageUrl } from "@/utils"; // Import the new utility

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy - Pet Decoder AI | GDPR, CCPA & PIPEDA Compliant"
        description="Our commitment to your privacy. Learn how Pet Decoder AI collects, uses, and protects your personal information. GDPR, CCPA, and PIPEDA compliant."
        keywords="privacy policy, data protection, GDPR, CCPA, PIPEDA, pet app privacy, data security"
        canonicalUrl="https://yourapp.base44.com/privacy-policy"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-purple-100">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-600" />
                <div>
                  <CardTitle className="text-3xl">Privacy Policy</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Last Updated: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-gray-700 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                <p>
                  Pet Decoder AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our application and services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Email address, name</li>
                  <li><strong>Pet Information:</strong> Pet name, species, breed, age</li>
                  <li><strong>Media Files:</strong> Photos and videos you upload of your pets. Videos are capped at 5 minutes, and only specific frames are extracted for AI analysis, not the entire video stream.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">2.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                  <li><strong>Usage Data:</strong> App features used, analysis requests, timestamps</li>
                  <li><strong>Technical Data:</strong> IP address, log files, error reports</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                <p className="mb-2">We use your information for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>AI Processing:</strong> Analyzing pet behavior in uploaded media</li>
                  <li><strong>Service Delivery:</strong> Providing personalized insights and recommendations</li>
                  <li><strong>Account Management:</strong> Creating and maintaining your account</li>
                  <li><strong>Improvement:</strong> Improving our AI models and app functionality</li>
                  <li><strong>Communication:</strong> Sending analysis results and important updates</li>
                  <li><strong>Security:</strong> Protecting against fraud and unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Data Storage and Retention</h2>
                <p className="mb-2"><strong>Storage Location:</strong> Your data is stored on secure cloud servers (AWS/Google Cloud) with servers located in [US/EU - specify your region].</p>
                <p className="mb-2"><strong>Retention Period:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Videos and photos: Stored until you delete them or request account deletion</li>
                  <li>Analysis results: Stored until you delete them or request account deletion</li>
                  <li>Account data: Stored while your account is active</li>
                  <li>All data is permanently deleted within 30 days of account deletion request</li>
                </ul>
                <p className="mt-3 text-sm bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <strong>Account Deletion Process:</strong> When you request account deletion through Settings, your account is immediately marked for deletion and you are logged out. You have a 30-day grace period during which you can cancel the deletion by contacting support or logging back in. After 30 days, all your data (including all pet profiles, analyses, photos, videos, and personal information) will be permanently and irreversibly deleted from our systems via an automated backend process, as required by GDPR, CCPA, and PIPEDA. During this 30-day period, your account and data remain in our system but are inaccessible to you.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Sharing and Third Parties</h2>
                <p className="mb-2">We share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>AI Service Providers:</strong> Third-party AI APIs for behavior analysis (data is processed but not stored by providers)</li>
                  <li><strong>Cloud Storage:</strong> Secure cloud infrastructure providers (AWS, Google Cloud, Firebase)</li>
                  <li><strong>Analytics:</strong> Anonymized usage data for service improvement</li>
                </ul>
                <p className="mt-3 font-semibold">We do NOT:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sell your personal information to third parties</li>
                  <li>Share your media publicly without explicit consent</li>
                  <li>Use your data to train AI models without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights and Choices</h2>
                <p className="mb-2">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct your information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (right to be forgotten)</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Receive your data in a machine-readable format</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
                </ul>
                <p className="mt-3">
                  <strong>California Residents (CCPA):</strong> You have the right to opt-out of the "sale" of personal information. We do not sell personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Data Security</h2>
                <p className="mb-2">We implement industry-standard security measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>End-to-end encryption (TLS 1.3) for data in transit</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited employee access to personal data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">8. International Data Transfers</h2>
                <p>
                  Your data may be transferred to and processed in countries outside your residence. We ensure adequate protection through Standard Contractual Clauses (SCCs) and Data Processing Agreements (DPAs) with all vendors.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Children's Privacy</h2>
                <p>
                  Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Data Breach Notification</h2>
                <p>
                  In the event of a data breach affecting your personal information, we will notify you and relevant authorities within 72 hours as required by GDPR and other applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification. Continued use of the service after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Contact Us</h2>
                <div className="bg-purple-50 p-6 rounded-xl space-y-3">
                  <p className="font-semibold text-gray-900">Data Protection Officer / Privacy Officer:</p>
                  <div className="space-y-3">
                    <div>
                      <a 
                        href={createPageUrl("Contact")} 
                        className="inline-flex items-center gap-2 text-purple-600 hover:underline font-semibold"
                      >
                        <Mail className="w-5 h-5" />
                        Contact Us via Form
                      </a>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="font-semibold text-gray-900 mb-2">Mailing Address:</p>
                    <div className="text-gray-700">
                      <p className="font-semibold">Pet Decoder AI Inc.</p>
                      <p>287-2967 Dundas St. W.</p>
                      <p>Toronto, Ontario M6P 1Z2</p>
                      <p>Canada</p>
                    </div>
                  </div>
                  
                  {/* New "Your Rights - Quick Actions" section */}
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="font-semibold text-gray-900 mb-2">Your Rights - Quick Actions:</p>
                    <div className="space-y-2">
                      <Button
                        onClick={() => window.location.href = createPageUrl("Settings")}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Go to Settings to Export or Delete Your Data
                      </Button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600">
                    For GDPR requests, please include "GDPR Request" in the subject line.<br/>
                    For CCPA requests, please include "CCPA Request" in the subject line.<br/>
                    For PIPEDA requests, please include "PIPEDA Request" in the subject line.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Regulatory Compliance</h2>
                <p className="mb-2">This service complies with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>EU General Data Protection Regulation (GDPR)</li>
                  <li>UK GDPR</li>
                  <li>California Consumer Privacy Act (CCPA)</li>
                  <li>Canada's Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
                  <li>Quebec Law 25</li>
                  <li>Brazil's Lei Geral de Proteção de Dados (LGPD)</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
