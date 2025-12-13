import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      
      // Hide reconnected message after 3 seconds
      setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(!isOnline || showReconnected) && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
          style={{ marginTop: '0' }}
        >
          <div className="max-w-7xl mx-auto">
            <Alert
              variant={isOnline ? "default" : "destructive"}
              className={`${
                isOnline
                  ? 'bg-green-50 border-green-300 text-green-900'
                  : 'bg-red-50 border-red-300'
              } shadow-lg`}
            >
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              <AlertDescription className="ml-2 font-medium">
                {isOnline
                  ? "You're back online! All features are now available."
                  : "You're offline. Some features may not work until you reconnect."}
              </AlertDescription>
            </Alert>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}