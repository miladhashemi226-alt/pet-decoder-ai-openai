import { base44 } from "@/api/base44Client";

/**
 * Email notification utilities that respect user preferences
 */

/**
 * Check if user has enabled a specific notification type
 */
export const hasNotificationEnabled = (user, notificationType) => {
  if (!user || !user.notification_preferences) {
    return true; // Default to enabled if no preferences set
  }
  
  const prefs = user.notification_preferences;
  
  switch (notificationType) {
    case 'email':
      return prefs.email_notifications !== false;
    case 'behavior_alerts':
      return prefs.behavior_alerts !== false;
    case 'vaccine_alerts':
      return prefs.vaccine_alerts !== false;
    case 'weekly_summary':
      return prefs.weekly_summary !== false;
    default:
      return true;
  }
};

/**
 * Send behavior alert email
 */
export const sendBehaviorAlertEmail = async (user, pet, analysis) => {
  if (!hasNotificationEnabled(user, 'email') || !hasNotificationEnabled(user, 'behavior_alerts')) {
    console.log('Behavior alerts disabled for user');
    return { sent: false, reason: 'disabled' };
  }

  try {
    const subject = `⚠️ Behavior Alert: ${pet.name} showing ${analysis.emotion_detected}`;
    
    const body = `
Hello ${user.full_name || 'there'},

We've detected concerning behavior in your recent analysis of ${pet.name}.

🐾 Pet: ${pet.name} (${pet.species})
😟 Emotion Detected: ${analysis.emotion_detected}
📊 Confidence: ${analysis.confidence_level}%

Summary:
${analysis.behavior_summary}

${analysis.recommendations && analysis.recommendations.length > 0 ? `
Recommendations:
${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
` : ''}

View full analysis: ${window.location.origin}/AnalysisDetail?id=${analysis.id}

You can manage your notification preferences in Settings.

Best regards,
Pet Decoder AI Team

---
This is an automated notification from Pet Decoder AI.
`;

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject,
      body,
      from_name: 'Pet Decoder AI'
    });

    return { sent: true };
  } catch (error) {
    console.error('Error sending behavior alert email:', error);
    return { sent: false, reason: 'error', error };
  }
};

/**
 * Send vaccine reminder email
 */
export const sendVaccineReminderEmail = async (user, pet, vaccineRecord, daysUntilDue) => {
  if (!hasNotificationEnabled(user, 'email') || !hasNotificationEnabled(user, 'vaccine_alerts')) {
    console.log('Vaccine alerts disabled for user');
    return { sent: false, reason: 'disabled' };
  }

  try {
    const isOverdue = daysUntilDue < 0;
    const urgency = isOverdue ? '🚨 OVERDUE' : daysUntilDue <= 7 ? '⚠️ URGENT' : '📅 UPCOMING';
    
    const subject = `${urgency}: ${pet.name}'s ${vaccineRecord.vaccine_name} Vaccine ${isOverdue ? 'Overdue' : 'Due Soon'}`;
    
    const body = `
Hello ${user.full_name || 'there'},

${isOverdue 
  ? `${pet.name}'s ${vaccineRecord.vaccine_name} vaccine is ${Math.abs(daysUntilDue)} days overdue!` 
  : `${pet.name}'s ${vaccineRecord.vaccine_name} vaccine is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}.`
}

🐾 Pet: ${pet.name} (${pet.species})
💉 Vaccine: ${vaccineRecord.vaccine_name}
📅 Due Date: ${new Date(vaccineRecord.next_due_date).toLocaleDateString()}
${vaccineRecord.veterinarian ? `👨‍⚕️ Last Veterinarian: ${vaccineRecord.veterinarian}` : ''}
${vaccineRecord.clinic_name ? `🏥 Last Clinic: ${vaccineRecord.clinic_name}` : ''}

${isOverdue 
  ? '⚠️ This vaccine is overdue. Please schedule an appointment with your veterinarian as soon as possible.'
  : 'Please schedule an appointment with your veterinarian to keep your pet protected.'
}

Manage vaccine records: ${window.location.origin}/VaccineReminders

You can disable vaccine reminders in Settings.

Best regards,
Pet Decoder AI Team

---
This is an automated reminder from Pet Decoder AI.
`;

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject,
      body,
      from_name: 'Pet Decoder AI'
    });

    return { sent: true };
  } catch (error) {
    console.error('Error sending vaccine reminder email:', error);
    return { sent: false, reason: 'error', error };
  }
};

/**
 * Send weekly summary email
 */
export const sendWeeklySummaryEmail = async (user, pets, weeklyAnalyses) => {
  if (!hasNotificationEnabled(user, 'email') || !hasNotificationEnabled(user, 'weekly_summary')) {
    console.log('Weekly summaries disabled for user');
    return { sent: false, reason: 'disabled' };
  }

  try {
    const totalAnalyses = weeklyAnalyses.length;
    const emotionCounts = weeklyAnalyses.reduce((acc, analysis) => {
      acc[analysis.emotion_detected] = (acc[analysis.emotion_detected] || 0) + 1;
      return acc;
    }, {});

    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];
    
    const subject = `📊 Weekly Pet Behavior Summary - ${totalAnalyses} Analysis${totalAnalyses !== 1 ? 'es' : ''} This Week`;
    
    const body = `
Hello ${user.full_name || 'there'},

Here's your weekly pet behavior summary for the past 7 days.

📈 Overall Stats:
• Total Analyses: ${totalAnalyses}
• Most Common Emotion: ${topEmotion ? `${topEmotion[0]} (${topEmotion[1]} times)` : 'N/A'}
• Active Pets: ${pets.length}

${pets.map(pet => {
  const petAnalyses = weeklyAnalyses.filter(a => a.pet_id === pet.id);
  if (petAnalyses.length === 0) return '';
  
  const petEmotions = petAnalyses.map(a => a.emotion_detected).join(', ');
  
  return `
🐾 ${pet.name} (${pet.species}):
   • Analyses: ${petAnalyses.length}
   • Emotions: ${petEmotions}
`;
}).filter(Boolean).join('\n')}

${weeklyAnalyses.length > 0 ? `
Recent Highlights:
${weeklyAnalyses.slice(0, 3).map((analysis, i) => {
  const pet = pets.find(p => p.id === analysis.pet_id);
  return `${i + 1}. ${pet?.name || 'Unknown'}: ${analysis.emotion_detected} - ${analysis.behavior_summary.substring(0, 100)}...`;
}).join('\n')}
` : ''}

View all analyses: ${window.location.origin}/History

Keep tracking your pet's behavior to build better insights!

You can disable weekly summaries in Settings.

Best regards,
Pet Decoder AI Team

---
This is your weekly automated summary from Pet Decoder AI.
`;

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject,
      body,
      from_name: 'Pet Decoder AI'
    });

    return { sent: true };
  } catch (error) {
    console.error('Error sending weekly summary email:', error);
    return { sent: false, reason: 'error', error };
  }
};

/**
 * Send test email (for user to verify email settings)
 */
export const sendTestEmail = async (user) => {
  try {
    const subject = '✅ Pet Decoder AI - Email Notifications Enabled';
    
    const body = `
Hello ${user.full_name || 'there'},

This is a test email to confirm that your email notifications are working correctly!

Your current notification settings:
• Email Notifications: ${hasNotificationEnabled(user, 'email') ? '✅ Enabled' : '❌ Disabled'}
• Behavior Alerts: ${hasNotificationEnabled(user, 'behavior_alerts') ? '✅ Enabled' : '❌ Disabled'}
• Vaccine Reminders: ${hasNotificationEnabled(user, 'vaccine_alerts') ? '✅ Enabled' : '❌ Disabled'}
• Weekly Summaries: ${hasNotificationEnabled(user, 'weekly_summary') ? '✅ Enabled' : '❌ Disabled'}

You can update these preferences anytime in Settings.

Best regards,
Pet Decoder AI Team

---
This is a test notification from Pet Decoder AI.
`;

    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject,
      body,
      from_name: 'Pet Decoder AI'
    });

    return { sent: true };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { sent: false, reason: 'error', error };
  }
};