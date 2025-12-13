

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Upload, History, Settings, PawPrint, TrendingUp, Bell, BookOpen, Activity, Award, MessageCircle, Syringe, Menu, X, Mail, Brain, Shield } from "lucide-react";
import { User } from "@/api/entities";
import { getUserTimezone, getTimezoneAbbreviation } from "@/components/utils/dateFormatter";
import GlobalErrorBoundary from "@/components/common/GlobalErrorBoundary";
import AccessibilityMenu from "@/components/common/AccessibilityMenu";
import AppLogo from "@/components/common/AppLogo";
import OfflineDetector from "@/components/common/OfflineDetector";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Analyze", url: createPageUrl("Analyze"), icon: Upload },
  { title: "Ask AI", url: createPageUrl("AskAI"), icon: MessageCircle },
  { title: "Trends", url: createPageUrl("Trends"), icon: TrendingUp },
  { title: "Alerts", url: createPageUrl("Notifications"), icon: Bell },
  { title: "Vaccine Reminders", url: createPageUrl("VaccineReminders"), icon: Syringe },
  { title: "History", url: createPageUrl("History"), icon: History },
  { title: "Achievements", url: createPageUrl("Achievements"), icon: Award },
  { title: "Pet Care Library", url: createPageUrl("EducationalContent"), icon: BookOpen },
  { title: "Activity Log", url: createPageUrl("ActivityLog"), icon: Activity },
  { title: "Pet Profile", url: createPageUrl("PetProfile"), icon: PawPrint },
  { title: "Settings & Privacy", url: createPageUrl("Settings"), icon: Settings },
];

const adminNavigationItems = [
  { title: "Contact Submissions", url: createPageUrl("ContactSubmissions"), icon: Mail },
  { title: "AI Improvement Plan", url: createPageUrl("AIImprovementPlan"), icon: Brain },
];

const MobileNav = ({ isOpen, onClose, currentPath, user }) => {
  const handleSignOut = async () => {
    try {
      await User.logout();
      window.location.href = createPageUrl("Landing");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 bg-white">
        <div className="h-full flex flex-col">
          <div className="border-b border-purple-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AppLogo size="md" />
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Pet Decoder AI</h2>
                  <p className="text-xs text-gray-500">Understand your pet</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-purple-100 rounded-full"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3" role="navigation" aria-label="Mobile navigation">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-h-[44px] ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                          : 'hover:bg-purple-50 text-gray-700 active:bg-purple-100'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {isAdmin && (
              <>
                <div className="px-4 py-3 mt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    <span>Admin Tools</span>
                  </div>
                </div>
                <ul className="space-y-1">
                  {adminNavigationItems.map((item) => {
                    const isActive = currentPath === item.url;
                    return (
                      <li key={item.title}>
                        <Link
                          to={item.url}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-h-[44px] ${
                            isActive
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                              : 'hover:bg-amber-50 text-gray-700 active:bg-amber-100'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </nav>

          <div className="p-4 border-t border-purple-100 bg-gray-50">
            {user && (
              <div className="mb-3">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    aria-hidden="true"
                  >
                    {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{user.full_name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 min-h-[44px]"
                >
                  Sign Out
                </Button>
              </div>
            )}
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex gap-2 flex-wrap">
                <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-purple-600 transition-colors min-h-[44px] flex items-center" onClick={onClose}>
                  Privacy
                </Link>
                <span>•</span>
                <Link to={createPageUrl("TermsOfService")} className="hover:text-purple-600 transition-colors min-h-[44px] flex items-center" onClick={onClose}>
                  Terms
                </Link>
                <span>•</span>
                <Link to={createPageUrl("AITransparency")} className="hover:text-purple-600 transition-colors min-h-[44px] flex items-center" onClick={onClose}>
                  AI Info
                </Link>
              </div>
              <div className="text-center pt-2">
                <span className="font-medium">{getTimezoneAbbreviation()}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default function Layout({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.log("Failed to load user or user not authenticated:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const commonHeadElements = (
    <>
      <noscript>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          zIndex: 9999
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐾</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>Pet Decoder AI</h1>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>
            JavaScript is required to run this application. Please enable JavaScript in your browser settings to use Pet Decoder AI.
          </p>
        </div>
      </noscript>
      <style>{`
        :root {
          --primary: 237 84% 63%;
          --primary-foreground: 0 0% 100%;
          --secondary: 280 65% 95%;
          --accent: 25 95% 65%;
          --animation-duration: 200ms;
        }
        
        .high-contrast {
          --tw-border-opacity: 1;
          filter: contrast(1.2);
        }
        
        .high-contrast * {
          border-width: 2px !important;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        *:focus-visible {
          outline: 3px solid #8b5cf6;
          outline-offset: 2px;
          border-radius: 4px;
        }

        .skip-to-main {
          position: absolute;
          left: -9999px;
          z-index: 999;
          padding: 1rem;
          background: #8b5cf6;
          color: white;
          text-decoration: none;
          border-radius: 4px;
        }
        
        .skip-to-main:focus {
          left: 50%;
          transform: translateX(-50%);
          top: 1rem;
        }

        /* Better touch targets for mobile - minimum 44x44px */
        @media (max-width: 768px) {
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Increase tap area for small icons */
          button[size="icon"] {
            width: 44px;
            height: 44px;
          }
        }

        /* Improved mobile scrolling */
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Prevent text selection on tap (better mobile UX) */
        button, [role="button"] {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>
      
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
    </>
  );

  return (
    <GlobalErrorBoundary>
      {commonHeadElements}

      {/* Offline Detector - shows banner when connection lost */}
      <OfflineDetector />

      {isLoadingUser ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" role="status" aria-label="Loading application"></div>
            <p>Loading application...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <main className="flex-1" id="main-content" role="main">
            {children}
          </main>
        </div>
      ) : (
        <>
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <Sidebar className="border-r border-purple-100">
                  <SidebarHeader className="border-b border-purple-100 p-6">
                    <div className="flex items-center gap-3">
                      <AppLogo size="md" />
                      <div>
                        <h2 className="font-bold text-lg text-gray-900">Pet Decoder AI</h2>
                        <p className="text-xs text-gray-500">Understand your pet</p>
                      </div>
                    </div>
                  </SidebarHeader>
                  
                  <SidebarContent className="p-3">
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {navigationItems.map((item) => {
                            const isActive = location.pathname === item.url;
                            return (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                  asChild 
                                  className={`hover:bg-purple-100 transition-all duration-200 rounded-xl mb-1 ${
                                    isActive
                                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600' 
                                      : ''
                                  }`}
                                >
                                  <Link 
                                    to={item.url}
                                    className="flex items-center gap-3 px-4 py-3"
                                    aria-current={isActive ? 'page' : undefined}
                                  >
                                    <item.icon className="w-5 h-5" aria-hidden="true" />
                                    <span className="font-medium">{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>

                    {user?.role === 'admin' && (
                      <SidebarGroup>
                        <div className="px-4 py-3">
                          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <Shield className="w-4 h-4" />
                            <span>Admin Tools</span>
                          </div>
                        </div>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {adminNavigationItems.map((item) => {
                              const isActive = location.pathname === item.url;
                              return (
                                <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton 
                                    asChild 
                                    className={`hover:bg-amber-100 transition-all duration-200 rounded-xl mb-1 ${
                                      isActive
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' 
                                        : ''
                                    }`}
                                  >
                                    <Link 
                                      to={item.url}
                                      className="flex items-center gap-3 px-4 py-3"
                                      aria-current={isActive ? 'page' : undefined}
                                    >
                                      <item.icon className="w-5 h-5" aria-hidden="true" />
                                      <span className="font-medium">{item.title}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>
                    )}
                  </SidebarContent>

                  <SidebarFooter>
                    <div className="p-4 border-t border-purple-100">
                      {user && (
                        <div className="mb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                              aria-hidden="true"
                            >
                              {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{user.full_name || "User"}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                          <Button
                            onClick={async () => {
                              try {
                                await User.logout();
                                window.location.href = createPageUrl("Landing");
                              } catch (error) {
                                console.error("Error signing out:", error);
                              }
                            }}
                            variant="outline"
                            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Sign Out
                          </Button>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex gap-2 flex-wrap">
                          <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-purple-600 transition-colors">
                            Privacy
                          </Link>
                          <span>•</span>
                          <Link to={createPageUrl("TermsOfService")} className="hover:text-purple-600 transition-colors">
                            Terms
                          </Link>
                          <span>•</span>
                          <Link to={createPageUrl("AITransparency")} className="hover:text-purple-600 transition-colors">
                            AI Info
                          </Link>
                        </div>
                        <div className="text-center pt-2">
                          <span className="font-medium">{getTimezoneAbbreviation()}</span>
                        </div>
                      </div>
                    </div>
                  </SidebarFooter>
                </Sidebar>

                <main className="flex-1 flex flex-col overflow-x-hidden" id="main-content" role="main">
                  <div className="flex-1 overflow-auto">
                    {children}
                  </div>
                </main>
              </div>
            </SidebarProvider>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-3 sticky top-0 z-40 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileNavOpen(true)}
                className="hover:bg-purple-100 rounded-xl flex-shrink-0"
                aria-label="Open navigation menu"
                aria-expanded={mobileNavOpen}
              >
                <Menu className="w-6 h-6" />
              </Button>
              <AppLogo size="sm" />
              <h1 className="text-lg font-bold">Pet Decoder AI</h1>
            </header>

            <main className="flex-1 overflow-auto" id="main-content" role="main">
              {children}
            </main>

            <MobileNav
              isOpen={mobileNavOpen}
              onClose={() => setMobileNavOpen(false)}
              currentPath={location.pathname}
              user={user}
            />
          </div>
        </>
      )}
      <AccessibilityMenu />
    </GlobalErrorBoundary>
  );
}

