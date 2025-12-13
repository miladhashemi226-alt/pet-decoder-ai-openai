import React, { useEffect } from "react";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";

// Home page redirects to appropriate page based on auth status
export default function Home() {
  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const user = await User.me();
      
      if (!user.onboarding_completed) {
        window.location.href = createPageUrl("Onboarding");
      } else {
        window.location.href = createPageUrl("Dashboard");
      }
    } catch (error) {
      // Not authenticated, go to landing
      window.location.href = createPageUrl("Landing");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}