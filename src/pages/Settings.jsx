
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings as SettingsIcon, Bell, Download, Trash2, Shield, AlertTriangle, CheckCircle, Loader2, Mail, Syringe } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { sendTestEmail, sendVaccineReminderEmail } from "../components/utils/emailNotifications";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    behavior_alerts: true,
    weekly_summary: true,
    vaccine_alerts: true
  });
  const [consents, setConsents] = useState({
    data_processing_consent: true,
    marketing_consent: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      if (currentUser.notification_preferences) {
        setPreferences(prev => ({ ...prev, ...currentUser.notification_preferences }));
      }
      
      // Load consent settings
      setConsents({
        data_processing_consent: currentUser.data_processing_consent !== false,
        marketing_consent: currentUser.marketing_consent === true
      });
    } catch (error) {
      console.error("Error loading user settings:", error);
      setMessage({ type: "error", text: "Failed to load settings" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      await base44.auth.updateMe({
        notification_preferences: preferences,
        data_processing_consent: consents.data_processing_consent,
        marketing_consent: consents.marketing_consent
      });
      
      // Reload user to get updated preferences
      const updatedUser = await base44.auth.me();
      setUser(updatedUser);
      
      setMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setMessage({ type: "error", text: "Failed to save settings. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setMessage(null);
    
    try {
      const result = await sendTestEmail(user); 
      
      if (result.sent) {
        setMessage({ type: "success", text: "Test email sent! Check your inbox." });
      } else {
        setMessage({ type: "error", text: "Failed to send test email. Please try again." });
      }
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error("Error sending test email:", error);
      setMessage({ type: "error", text: "Failed to send test email. Please try again." });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSendTestVaccineReminder = async () => {
    setIsSendingTest(true);
    setMessage(null);
    
    try {
      // Check current preferences state (not saved user state)
      if (!preferences.email_notifications || !preferences.vaccine_alerts) {
        setMessage({ 
          type: "error", 
          text: preferences.email_notifications 
            ? "Vaccine alerts are disabled. Please enable them first." 
            : "Email notifications are disabled. Please enable them first." 
        });
        setIsSendingTest(false);
        setTimeout(() => setMessage(null), 5000);
        return;
      }

      // Get user's first pet (or create mock data)
      const petsData = await base44.entities.Pet.list();
      const pets = Array.isArray(petsData) ? petsData : [];
      
      const mockPet = pets.length > 0 ? pets[0] : {
        name: "Fluffy",
        species: "cat",
        id: "mock-pet-id"
      };
      
      // Create mock vaccine record
      const mockVaccineRecord = {
        id: "test-vaccine-id",
        vaccine_name: mockPet.species === "dog" ? "DHPP" : "FVRCP",
        next_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
        date_administered: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        veterinarian: "Dr. Smith",
        clinic_name: "Happy Pets Veterinary Clinic"
      };
      
      // Create a temporary user object with current preferences for testing
      const testUser = {
        ...user,
        notification_preferences: preferences
      };
      
      const result = await sendVaccineReminderEmail(testUser, mockPet, mockVaccineRecord, 7);
      
      if (result.sent) {
        setMessage({ type: "success", text: "Test vaccine reminder sent! Check your inbox." });
      } else if (result.reason === 'disabled') {
        setMessage({ type: "error", text: "Vaccine alerts are disabled in your preferences." });
      } else {
        setMessage({ type: "error", text: "Failed to send test vaccine reminder. Please try again." });
      }
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error("Error sending test vaccine reminder:", error);
      setMessage({ type: "error", text: "Failed to send test vaccine reminder. Please try again." });
    } finally {
      setIsSendingTest(false);
    }
  };

  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setMessage(null);
    
    try {
      const [userData, pets, analyses, vaccineRecords, activityLogs] = await Promise.all([
        base44.auth.me(),
        base44.entities.Pet.list().catch(() => []),
        base44.entities.Analysis.list("-created_date", 1000).catch(() => []),
        base44.entities.VaccinationRecord.list().catch(() => []),
        base44.entities.ActivityLog.list().catch(() => [])
      ]);

      const exportData = {
        export_date: new Date().toISOString(),
        export_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        user: {
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          created_date: userData.created_date,
          notification_preferences: userData.notification_preferences,
          preferred_language: userData.preferred_language,
          data_processing_consent: userData.data_processing_consent,
          marketing_consent: userData.marketing_consent,
          last_privacy_policy_accepted: userData.last_privacy_policy_accepted
        },
        pets: Array.isArray(pets) ? pets.map(pet => ({
          id: pet.id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          gender: pet.gender,
          birthday: pet.birthday,
          photo_url: pet.photo_url,
          created_date: pet.created_date,
          updated_date: pet.updated_date
        })) : [],
        analyses: Array.isArray(analyses) ? analyses.map(analysis => ({
          id: analysis.id,
          pet_id: analysis.pet_id,
          created_date: analysis.created_date,
          emotion_detected: analysis.emotion_detected,
          confidence_level: analysis.confidence_level,
          behavior_summary: analysis.behavior_summary,
          detailed_analysis: analysis.detailed_analysis,
          possible_reasons: analysis.possible_reasons,
          recommendations: analysis.recommendations,
          audio_analyzed: analysis.audio_analyzed,
          video_url: analysis.video_url
        })) : [],
        vaccination_records: Array.isArray(vaccineRecords) ? vaccineRecords.map(record => ({
          id: record.id,
          pet_id: record.pet_id,
          vaccine_name: record.vaccine_name,
          date_administered: record.date_administered,
          next_due_date: record.next_due_date,
          veterinarian: record.veterinarian,
          clinic_name: record.clinic_name,
          notes: record.notes,
          created_date: record.created_date
        })) : [],
        activity_logs: Array.isArray(activityLogs) ? activityLogs.map(log => ({
          id: log.id,
          pet_id: log.pet_id,
          activity_type: log.activity_type,
          duration: log.duration,
          notes: log.notes,
          mood: log.mood,
          date: log.date,
          created_date: log.created_date
        })) : []
      };

      const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement('a');
      jsonLink.href = jsonUrl;
      jsonLink.download = `pet-decoder-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);
      URL.revokeObjectURL(jsonUrl);

      if (analyses.length > 0) {
        const analysesCsv = [
          ['Date', 'Pet ID', 'Emotion', 'Confidence', 'Summary', 'Recommendations'].map(escapeCSVValue).join(','),
          ...analyses.map(a => [
            format(new Date(a.created_date), 'yyyy-MM-dd HH:mm'),
            a.pet_id,
            a.emotion_detected || 'N/A',
            a.confidence_level || 0,
            (a.behavior_summary || 'N/A').replace(/\n/g, ' '),
            Array.isArray(a.recommendations) ? a.recommendations.join('; ') : 'N/A'
          ].map(escapeCSVValue).join(','))
        ].join('\n');

        const analysesCsvBlob = new Blob([analysesCsv], { type: 'text/csv' });
        const analysesCsvUrl = URL.createObjectURL(analysesCsvBlob);
        const analysesCsvLink = document.createElement('a');
        analysesCsvLink.href = analysesCsvUrl;
        analysesCsvLink.download = `analyses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(analysesCsvLink);
        analysesCsvLink.click();
        document.body.removeChild(analysesCsvLink);
        URL.revokeObjectURL(analysesCsvUrl);
      }

      setMessage({ type: "success", text: "Data exported successfully! Check your downloads." });
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error("Error exporting data:", error);
      setMessage({ type: "error", text: "Failed to export data. Please try again." });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setMessage(null);
    
    try {
      // Mark account for deletion - DO NOT delete data immediately
      // This allows for 30-day grace period as required by GDPR/CCPA/PIPEDA
      // 
      // BACKEND REQUIREMENT: A scheduled backend process must run daily to:
      // 1. Query users where account_deletion_requested === true AND account_deletion_date is 30+ days old
      // 2. Delete all Pet, Analysis, VaccinationRecord, ActivityLog records for that user
      // 3. Delete all media files (videos/photos) from cloud storage
      // 4. Delete the User record
      // 5. Send confirmation email
      // 
      // CANCELLATION: User can cancel by logging back in within 30 days.
      // On login, check if account_deletion_requested === true, and if so, set it to false.
      
      await base44.auth.updateMe({
        account_deletion_requested: true,
        account_deletion_date: new Date().toISOString()
      });
      
      // Show confirmation message
      setMessage({ 
        type: "success", 
        text: "Account deletion scheduled. You will receive a confirmation email. Your data will be permanently deleted in 30 days. Contact support within 30 days to cancel this request." 
      });
      
      // Log out user after 3 seconds
      setTimeout(async () => {
        try {
          await base44.auth.logout(createPageUrl("Landing"));
        } catch (error) {
          console.error("Logout error:", error);
          window.location.href = createPageUrl("Landing");
        }
      }, 3000);
      
    } catch (error) {
      console.error("Error scheduling account deletion:", error);
      setMessage({ 
        type: "error", 
        text: "Failed to schedule account deletion. Please try again or contact support." 
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Settings & Privacy - Manage Your Account | Pet Decoder AI"
        description="Manage your account settings, privacy preferences, and data export options."
        noIndex={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-10 h-10 text-purple-600" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Settings & Privacy
              </h1>
            </div>
            <p className="text-gray-600">Manage your account and privacy preferences</p>
          </motion.div>

          {message && (
            <Alert 
              variant={message.type === "error" ? "destructive" : "default"}
              className="mb-6"
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Account Information */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="text-lg font-semibold">{user?.email}</p>
              </div>
              <div>
                <Label className="text-gray-600">Full Name</Label>
                <p className="text-lg font-semibold">{user?.full_name || "Not set"}</p>
              </div>
              <div>
                <Label className="text-gray-600">Account Role</Label>
                <p className="text-lg font-semibold capitalize">{user?.role || "user"}</p>
              </div>
              {user?.created_date && (
                <div>
                  <Label className="text-gray-600">Member Since</Label>
                  <p className="text-lg font-semibold">
                    {format(new Date(user.created_date), 'MMMM dd, yyyy')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Privacy Consents */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Consents (GDPR/CCPA/PIPEDA)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="data-processing" className="text-base font-semibold cursor-pointer">
                    Data Processing Consent
                  </Label>
                  <p className="text-sm text-gray-600">
                    Required for the app to function. Allows us to process your pet's data for behavior analysis.
                  </p>
                </div>
                <Switch
                  id="data-processing"
                  checked={consents.data_processing_consent}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      alert("Data processing consent is required for the app to function. If you wish to withdraw consent, please delete your account.");
                      return;
                    }
                    setConsents(prev => ({
                      ...prev,
                      data_processing_consent: checked
                    }));
                  }}
                  disabled={true}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="marketing-consent" className="text-base font-semibold cursor-pointer">
                    Marketing Communications
                  </Label>
                  <p className="text-sm text-gray-600">
                    Receive promotional emails, newsletters, and product updates (optional)
                  </p>
                </div>
                <Switch
                  id="marketing-consent"
                  checked={consents.marketing_consent}
                  onCheckedChange={(checked) => setConsents(prev => ({
                    ...prev,
                    marketing_consent: checked
                  }))}
                />
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  You can withdraw consent at any time. Withdrawing data processing consent will require account deletion as the app cannot function without processing your pet's data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="email-notifications" className="text-base font-semibold cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-600">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={preferences.email_notifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    email_notifications: checked
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="behavior-alerts" className="text-base font-semibold cursor-pointer">
                    Behavior Alerts
                  </Label>
                  <p className="text-sm text-gray-600">
                    Get notified about concerning behavioral patterns
                  </p>
                </div>
                <Switch
                  id="behavior-alerts"
                  checked={preferences.behavior_alerts}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    behavior_alerts: checked
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="weekly-summary" className="text-base font-semibold cursor-pointer">
                    Weekly Summary
                  </Label>
                  <p className="text-sm text-gray-600">
                    Receive weekly behavior analysis summaries
                  </p>
                </div>
                <Switch
                  id="weekly-summary"
                  checked={preferences.weekly_summary}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    weekly_summary: checked
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="vaccine-alerts" className="text-base font-semibold cursor-pointer">
                    Vaccine Reminders
                  </Label>
                  <p className="text-sm text-gray-600">
                    Reminders for upcoming vaccinations
                  </p>
                </div>
                <Switch
                  id="vaccine-alerts"
                  checked={preferences.vaccine_alerts}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    vaccine_alerts: checked
                  }))}
                />
              </div>

              <Button
                onClick={handleSavePreferences}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>

              {/* Test Email Buttons - Admin Only */}
              {user?.role === 'admin' && (
                <>
                  <div className="mt-4 pt-4 border-t border-purple-200">
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                      <Shield className="w-3 h-3" />
                      Admin Testing Tools
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleSendTestEmail}
                        disabled={isSendingTest || !preferences.email_notifications}
                        variant="outline"
                        className="border-purple-300"
                      >
                        {isSendingTest ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Test Email
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={handleSendTestVaccineReminder}
                        disabled={isSendingTest || !preferences.email_notifications || !preferences.vaccine_alerts}
                        variant="outline"
                        className="border-purple-300"
                      >
                        {isSendingTest ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Syringe className="w-4 h-4 mr-2" />
                            Test Vaccine Alert
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Export Your Data</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Download all your data including pet profiles, analyses, and activity logs in JSON and CSV formats.
                </p>
                <Button
                  onClick={handleExportData}
                  disabled={isExporting}
                  variant="outline"
                  className="border-purple-300 hover:bg-purple-50"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Legal */}
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm mb-6">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Legal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Link to={createPageUrl("PrivacyPolicy")}>
                <Button variant="ghost" className="w-full justify-start">
                  Privacy Policy
                </Button>
              </Link>
              <Link to={createPageUrl("TermsOfService")}>
                <Button variant="ghost" className="w-full justify-start">
                  Terms of Service
                </Button>
              </Link>
              <Link to={createPageUrl("AITransparency")}>
                <Button variant="ghost" className="w-full justify-start">
                  AI Transparency
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-2 border-red-300 shadow-xl bg-red-50">
            <CardHeader className="border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h3 className="font-semibold text-red-900 mb-2">Delete Account</h3>
              <p className="text-sm text-red-800 mb-4">
                Request permanent deletion of your account and all associated data. This action cannot be undone.
                Your data will be completely removed within 30 days as required by GDPR/CCPA/PIPEDA.
              </p>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Request Account Deletion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Request Account Deletion?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>This will mark your account for deletion. Within 30 days, all your data will be permanently deleted, including:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All pet profiles and photos</li>
                <li>All behavior analyses and videos</li>
                <li>All activity logs and vaccination records</li>
                <li>Your account information and settings</li>
              </ul>
              <p className="font-semibold mt-4 text-red-600">You will be logged out and receive an email confirmation. Your data will be permanently deleted within 30 days.</p>
              <p className="text-sm mt-2">If you change your mind within 30 days, contact support to cancel the deletion request.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Yes, request deletion
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
