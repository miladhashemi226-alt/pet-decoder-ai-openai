
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, CheckCircle, AlertCircle, MapPin, Clock, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ContactSubmission } from "@/api/entities";
import SEO from "../components/common/SEO";

// Rate limiting for contact form
const CONTACT_RATE_LIMIT_WINDOW = 3600000; // 1 hour
const MAX_CONTACT_SUBMISSIONS = 3; // 3 submissions per hour

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "" // Honeypot field for bot detection
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: "success" | "error", message: string }
  const [errors, setErrors] = useState({}); // { fieldName: "error message" }
  const [rateLimitInfo, setRateLimitInfo] = useState({
    remaining: MAX_CONTACT_SUBMISSIONS,
    resetTime: null
  });

  useEffect(() => {
    checkRateLimit();
  }, []);

  const checkRateLimit = () => {
    try {
      const rateLimitData = JSON.parse(localStorage.getItem('contact_rate_limit') || '{"submissions": []}');
      const now = Date.now();
      
      // Filter out submissions older than the window
      const recentSubmissions = rateLimitData.submissions.filter(
        timestamp => now - timestamp < CONTACT_RATE_LIMIT_WINDOW
      );
      
      const remaining = Math.max(0, MAX_CONTACT_SUBMISSIONS - recentSubmissions.length);
      const oldestSubmission = recentSubmissions[0];
      const resetTime = oldestSubmission ? new Date(oldestSubmission + CONTACT_RATE_LIMIT_WINDOW) : null;
      
      setRateLimitInfo({ remaining, resetTime });
      
      // Update localStorage with filtered submissions
      localStorage.setItem('contact_rate_limit', JSON.stringify({
        submissions: recentSubmissions
      }));
    } catch (error) {
      console.error("Error checking rate limit:", error);
    }
  };

  const recordSubmission = () => {
    try {
      const rateLimitData = JSON.parse(localStorage.getItem('contact_rate_limit') || '{"submissions": []}');
      const now = Date.now();
      rateLimitData.submissions.push(now);
      localStorage.setItem('contact_rate_limit', JSON.stringify(rateLimitData));
      checkRateLimit(); // Re-check immediately to update remaining count
    } catch (error) {
      console.error("Error recording submission:", error);
    }
  };

  const isRateLimited = () => {
    return rateLimitInfo.remaining <= 0;
  };

  const getRateLimitMessage = () => {
    if (!rateLimitInfo.resetTime) return "";
    const minutesLeft = Math.ceil((rateLimitInfo.resetTime - Date.now()) / 60000);
    return `Please wait ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} before submitting again.`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Allow honeypot to be updated without sanitization
    if (name === "honeypot") {
        setFormData({
            ...formData,
            [name]: value
        });
        return;
    }

    // Basic trim for all other fields
    const processedValue = value.trimStart(); // Trim leading spaces immediately

    setFormData({
      ...formData,
      [name]: processedValue
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitStatus(null);

    // Honeypot check - if filled, it's a bot. Respond as if successful to not give bots a hint.
    if (formData.honeypot) {
      console.log("Bot detected via honeypot");
      setSubmitStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you soon."
      });
      // Optionally, send this to a spam log without processing
      return;
    }

    // Rate limit check
    if (isRateLimited()) {
      setErrors({
        general: `Rate limit exceeded. ${getRateLimitMessage()}`
      });
      return;
    }

    // Validation
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters.";
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (!formData.subject?.trim()) {
      newErrors.subject = "Subject is required.";
    } else if (formData.subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters.";
    }
    
    if (!formData.message?.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    } else if (formData.message.length > 2000) {
      newErrors.message = "Message must be less than 2000 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Record submission for rate limiting
      recordSubmission();

      await ContactSubmission.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: "new"
        // ip_address will be captured by the backend
      });

      setSubmitStatus({
        type: "success",
        message: "Thank you for your message! We'll get back to you within 24-48 hours. A confirmation email has been sent if you're a registered user."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        honeypot: ""
      });
      
      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again or email us directly at support@petdecoder.ai"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us - Pet Decoder AI"
        description="Get in touch with Pet Decoder AI. We're here to help with any questions about our AI-powered pet behavior analysis platform."
        keywords="contact pet decoder, support, help, customer service"
        canonicalUrl="https://yourapp.base44.com/contact"
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Contact Us
            </h1>
            <p className="text-gray-600 text-lg">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert variant={submitStatus.type === "success" ? "default" : "destructive"} className={`mb-8 ${submitStatus.type === "success" ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {submitStatus.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <AlertDescription className={submitStatus.type === "success" ? 'text-green-900 ml-2' : 'text-red-900 ml-2'}>
                  {submitStatus.message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {errors.general && (
            <Alert variant="destructive" className="mb-8 bg-red-50 border-red-200">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-900 ml-2">
                {errors.general}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-none shadow-lg h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Address</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    287-2967 Dundas St. W.<br />
                    Toronto, Ontario M6P 1Z2<br />
                    Canada
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-none shadow-lg h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Response Time</h3>
                  <p className="text-gray-600 text-sm">
                    We typically respond within<br />
                    <span className="font-semibold text-gray-900">24-48 hours</span>
                    <br />
                    <span className="text-xs text-gray-500 mt-2 block">Monday - Friday</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-none shadow-lg h-full hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Privacy First</h3>
                  <p className="text-gray-600 text-sm">
                    Your information is<br />
                    <span className="font-semibold text-gray-900">protected & encrypted</span>
                    <br />
                    <span className="text-xs text-gray-500 mt-2 block">GDPR Compliant</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-none shadow-xl">
              <CardHeader className="border-b border-purple-100">
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Honeypot field - hidden from users */}
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor="honeypot-website">Website</Label>
                    <Input
                      id="honeypot-website"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base">
                        Your Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className={`mt-2 ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        disabled={isSubmitting}
                        maxLength={100}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1" id="name-error" role="alert">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-base">
                        Your Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className={`mt-2 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        disabled={isSubmitting}
                        maxLength={254}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1" id="email-error" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-base">
                      Subject <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      className={`mt-2 ${errors.subject ? 'border-red-300 focus:border-red-500' : ''}`}
                      aria-invalid={errors.subject ? 'true' : 'false'}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      disabled={isSubmitting}
                      maxLength={200}
                    />
                    {errors.subject && (
                      <p className="text-sm text-red-600 mt-1" id="subject-error" role="alert">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base">
                      Message <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide as much detail as possible..."
                      required
                      rows={6}
                      className={`mt-2 ${errors.message ? 'border-red-300 focus:border-red-500' : ''}`}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      disabled={isSubmitting}
                      maxLength={2000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.message ? (
                        <p className="text-sm text-red-600" id="message-error" role="alert">
                          {errors.message}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">
                          Minimum 10 characters
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formData.message.length} / 2000
                      </p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isRateLimited()}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : isRateLimited() ? (
                      <>
                        <Clock className="w-5 h-5 mr-2" />
                        Rate Limited
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {rateLimitInfo.remaining < MAX_CONTACT_SUBMISSIONS && (
                    <p className="text-sm text-center text-gray-600">
                      {rateLimitInfo.remaining} submission{rateLimitInfo.remaining !== 1 ? 's' : ''} remaining this hour.
                      {isRateLimited() && rateLimitInfo.resetTime && (
                        ` ${getRateLimitMessage()}`
                      )}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our{' '}
                    <a href={"/privacy-policy"} className="text-purple-600 hover:underline">Privacy Policy</a>
                    {' '}and{' '}
                    <a href={"/terms-of-service"} className="text-purple-600 hover:underline">Terms of Service</a>
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <p>
              <strong>Pet Decoder AI Inc.</strong> • 287-2967 Dundas St. W., Toronto, Ontario M6P 1Z2, Canada
            </p>
            <p className="mt-2">
              © 2025 Pet Decoder AI Inc. • GDPR, CCPA & PIPEDA Compliant
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
