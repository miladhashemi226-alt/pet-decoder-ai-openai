
import React, { useState, useEffect } from "react";
import { Analysis } from "@/api/entities";
import { User } from "@/api/entities";
import { Pet } from "@/api/entities";
import { VaccinationRecord } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, CheckCircle, Lock, ArrowRight, Syringe } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { formatFullDateTime, formatRelativeTime } from "@/components/utils/dateFormatter";
import SEO from "../components/common/SEO";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Removed premium feature check, notifications are always available
      await loadNotifications();
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const analysesData = await Analysis.list("-created_date", 50);
      const analyses = Array.isArray(analysesData) ? analysesData : [];
      
      const newNotifications = [];

      // Behavior-based notifications
      analyses.forEach((analysis, index) => {
        if (index < 10) {
          if (analysis.emotion_detected && 
              (analysis.emotion_detected.toLowerCase().includes('anxious') || 
               analysis.emotion_detected.toLowerCase().includes('stress'))) {
            newNotifications.push({
              id: `stress-${analysis.id}`,
              type: 'warning',
              icon: AlertTriangle,
              title: 'Stress Detected',
              message: `Your pet showed signs of ${analysis.emotion_detected} behavior`,
              timestamp: new Date(analysis.created_date),
              read: false
            });
          }
        }
      });

      // Vaccine reminders (only if vaccine alerts are enabled in user preferences)
      // `user` state should be available here as `checkAuthAndLoadData` sets it before calling this function.
      if (user?.notification_preferences?.vaccine_alerts !== false) {
        const [petsData, vaccineRecordsData] = await Promise.all([
          Pet.list(),
          VaccinationRecord.list()
        ]);
        
        const pets = Array.isArray(petsData) ? petsData : [];
        const vaccineRecords = Array.isArray(vaccineRecordsData) ? vaccineRecordsData : [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        vaccineRecords.forEach((record) => {
          if (record.next_due_date) {
            const dueDate = new Date(record.next_due_date);
            dueDate.setHours(0, 0, 0, 0);
            const timeDiff = dueDate.getTime() - today.getTime();
            const daysUntil = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            
            const pet = pets.find(p => p.id === record.pet_id);
            const petName = pet?.name || "Your pet";
            
            // Overdue vaccines
            if (daysUntil < 0 && daysUntil >= -30) {
              newNotifications.push({
                id: `vaccine-overdue-${record.id}`,
                type: 'warning',
                icon: Syringe,
                title: 'Vaccine Overdue',
                message: `${petName}'s ${record.vaccine_name} vaccine is ${Math.abs(daysUntil)} days overdue`,
                timestamp: dueDate,
                read: false,
                actionUrl: createPageUrl("VaccineReminders")
              });
            }
            // Due within 30 days (including today)
            else if (daysUntil >= 0 && daysUntil <= 30) {
              newNotifications.push({
                id: `vaccine-due-${record.id}`,
                type: 'info',
                icon: Syringe,
                title: 'Vaccine Due Soon',
                message: `${petName}'s ${record.vaccine_name} vaccine is due in ${daysUntil === 0 ? "today" : `${daysUntil} days`}`,
                timestamp: dueDate,
                read: false,
                actionUrl: createPageUrl("VaccineReminders")
              });
            }
            // Due within 90 days (gentle reminder)
            else if (daysUntil > 30 && daysUntil <= 90) {
              newNotifications.push({
                id: `vaccine-upcoming-${record.id}`,
                type: 'info',
                icon: Syringe,
                title: 'Upcoming Vaccine',
                message: `${petName}'s ${record.vaccine_name} vaccine is coming up in ${daysUntil} days`,
                timestamp: dueDate,
                read: false,
                actionUrl: createPageUrl("VaccineReminders")
              });
            }
          }
        });
      }

      // Sort notifications by timestamp descending (most recent first)
      setNotifications(newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'border-orange-300 bg-orange-50';
      case 'success': return 'border-green-300 bg-green-50';
      case 'info': return 'border-blue-300 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getAlertBadge = (type) => {
    switch (type) {
      case 'warning': return 'bg-orange-100 text-orange-700';
      case 'success': return 'bg-green-100 text-green-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Behavior Alerts - Stay Informed | Pet Decoder AI"
        description="View all behavior alerts and notifications for your pets. Stay informed about pattern changes and important insights."
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
                <Bell className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Notifications & Alerts
                </h1>
                <p className="text-gray-600">Stay updated on your pet's wellbeing</p>
              </div>
            </div>
          </motion.div>

          {notifications.length === 0 ? (
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
                <p className="text-gray-600">
                  No new alerts right now. Keep analyzing your pet's behavior regularly to get personalized insights.
                  Check your <Link to={createPageUrl("VaccineReminders")} className="text-purple-600 hover:underline">Vaccine Reminders</Link> to ensure everything is up-to-date.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-2 ${getAlertColor(notification.type)} shadow-lg hover:shadow-xl transition-shadow`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            notification.type === 'warning' ? 'bg-orange-200' :
                            notification.type === 'success' ? 'bg-green-200' :
                            notification.type === 'info' ? 'bg-blue-200' :
                            'bg-gray-200'
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-lg">{notification.title}</h3>
                              <Badge className={`${getAlertBadge(notification.type)} border-none`}>
                                {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-3">{notification.message}</p>
                            {notification.actionUrl && (
                              <Link to={notification.actionUrl}>
                                <Button variant="outline" size="sm" className="mt-2">
                                  View Details
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              {formatRelativeTime(notification.timestamp)} • {formatFullDateTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <Card className="border-none shadow-xl bg-purple-50 mt-8">
            <CardContent className="p-6">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Alert Settings
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Customize your notification preferences to stay informed about your pet's wellbeing and vaccine schedules.
              </p>
              <Button
                onClick={() => navigate(createPageUrl("Settings"))}
                variant="outline"
                className="border-purple-300"
              >
                Manage Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
