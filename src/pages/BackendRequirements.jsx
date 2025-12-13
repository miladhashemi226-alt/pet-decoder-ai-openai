import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, Server, Clock, Mail, AlertTriangle } from "lucide-react";
import SEO from "../components/common/SEO";

export default function BackendRequirements() {
  return (
    <>
      <SEO
        title="Backend Requirements - Admin Documentation | Pet Decoder AI"
        description="Technical documentation for backend scheduled tasks and email automation."
        noIndex={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-10 h-10 text-purple-600" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Backend Requirements
              </h1>
            </div>
            <p className="text-gray-600">Scheduled tasks and automation needed for email notifications</p>
          </div>

          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="ml-2 text-amber-900">
              <strong>Action Required:</strong> The following backend functions need to be implemented as scheduled tasks (cron jobs) to enable automated email notifications.
            </AlertDescription>
          </Alert>

          {/* Daily Vaccine Reminder Task */}
          <Card className="mb-6 border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Daily Vaccine Reminder Task
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Schedule:</h3>
                  <p className="text-gray-700">Run daily at 9:00 AM (user's local timezone preferred)</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Logic:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`async function sendDailyVaccineReminders() {
  // 1. Get all users
  const users = await User.list();
  
  for (const user of users) {
    // Skip if vaccine alerts disabled
    if (!user.notification_preferences?.vaccine_alerts) continue;
    
    // 2. Get all pets for this user
    const pets = await Pet.filter({ created_by: user.email });
    
    // 3. Get all vaccine records for user's pets
    const vaccineRecords = await VaccinationRecord.filter({
      created_by: user.email
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (const record of vaccineRecords) {
      if (!record.next_due_date) continue;
      
      const dueDate = new Date(record.next_due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      const daysUntil = Math.floor(
        (dueDate - today) / (1000 * 60 * 60 * 24)
      );
      
      // Send reminders for:
      // - 30 days before
      // - 14 days before
      // - 7 days before
      // - 3 days before
      // - Day of
      // - 7 days overdue
      // - 14 days overdue
      // - 30 days overdue
      
      const triggerDays = [30, 14, 7, 3, 0, -7, -14, -30];
      
      if (triggerDays.includes(daysUntil)) {
        const pet = pets.find(p => p.id === record.pet_id);
        if (pet) {
          await sendVaccineReminderEmail(
            user,
            pet,
            record,
            daysUntil
          );
          
          // Update reminder_sent flag
          await VaccinationRecord.update(record.id, {
            reminder_sent: true
          });
        }
      }
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Dependencies:</h3>
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>sendVaccineReminderEmail() from emailNotifications.js</li>
                    <li>Access to User, Pet, and VaccinationRecord entities</li>
                    <li>Core.SendEmail integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary Task */}
          <Card className="mb-6 border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Weekly Summary Task
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Schedule:</h3>
                  <p className="text-gray-700">Run weekly on Monday at 9:00 AM</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Logic:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`async function sendWeeklySummaries() {
  // 1. Get all users
  const users = await User.list();
  
  for (const user of users) {
    // Skip if weekly summaries disabled
    if (!user.notification_preferences?.weekly_summary) continue;
    
    // 2. Get all pets for this user
    const pets = await Pet.filter({ created_by: user.email });
    
    if (pets.length === 0) continue;
    
    // 3. Get analyses from past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const allAnalyses = await Analysis.filter({
      created_by: user.email
    }, '-created_date', 1000);
    
    const weeklyAnalyses = allAnalyses.filter(a => 
      new Date(a.created_date) >= sevenDaysAgo
    );
    
    // Only send if there were analyses this week
    if (weeklyAnalyses.length > 0) {
      await sendWeeklySummaryEmail(
        user,
        pets,
        weeklyAnalyses
      );
    }
  }
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Dependencies:</h3>
                  <ul className="list-disc ml-5 text-gray-700">
                    <li>sendWeeklySummaryEmail() from emailNotifications.js</li>
                    <li>Access to User, Pet, and Analysis entities</li>
                    <li>Core.SendEmail integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Deletion Task */}
          <Card className="mb-6 border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-purple-100">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Account Deletion Task (GDPR/CCPA/PIPEDA)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Schedule:</h3>
                  <p className="text-gray-700">Run daily at 2:00 AM</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Logic:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
{`async function processAccountDeletions() {
  // 1. Find users who requested deletion 30+ days ago
  const users = await User.list();
  const today = new Date();
  
  for (const user of users) {
    if (!user.account_deletion_requested) continue;
    if (!user.account_deletion_date) continue;
    
    const deletionDate = new Date(user.account_deletion_date);
    const daysSinceDeletion = Math.floor(
      (today - deletionDate) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceDeletion >= 30) {
      // 2. Delete all related data
      const pets = await Pet.filter({ created_by: user.email });
      const analyses = await Analysis.filter({ created_by: user.email });
      const vaccineRecords = await VaccinationRecord.filter({
        created_by: user.email
      });
      const activityLogs = await ActivityLog.filter({
        created_by: user.email
      });
      
      // Delete all records
      for (const pet of pets) await Pet.delete(pet.id);
      for (const analysis of analyses) {
        // Also delete media files from storage
        // await deleteFileFromStorage(analysis.video_url);
        await Analysis.delete(analysis.id);
      }
      for (const record of vaccineRecords) {
        await VaccinationRecord.delete(record.id);
      }
      for (const log of activityLogs) {
        await ActivityLog.delete(log.id);
      }
      
      // 3. Send confirmation email
      await Core.SendEmail({
        to: user.email,
        subject: 'Account Deletion Completed',
        body: \`Your Pet Decoder AI account and all associated 
               data have been permanently deleted.\`,
        from_name: 'Pet Decoder AI'
      });
      
      // 4. Delete user account
      await User.delete(user.id);
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Notes */}
          <Card className="border-none shadow-xl bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Implementation Notes
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• All scheduled tasks should use the base44 SDK for entity access</li>
                <li>• Respect user notification_preferences before sending emails</li>
                <li>• Log all email sends for debugging and compliance</li>
                <li>• Handle errors gracefully - don't break the loop if one email fails</li>
                <li>• Consider rate limiting for bulk email operations</li>
                <li>• Store last_sent_date on records to avoid duplicate reminders</li>
                <li>• Test with a small subset of users first</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}