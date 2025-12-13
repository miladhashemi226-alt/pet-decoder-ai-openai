import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Analyze from "./Analyze";

import History from "./History";

import PetProfile from "./PetProfile";

import PrivacyPolicy from "./PrivacyPolicy";

import TermsOfService from "./TermsOfService";

import AITransparency from "./AITransparency";

import Settings from "./Settings";

import Landing from "./Landing";

import Home from "./Home";

import Onboarding from "./Onboarding";

import EducationalContent from "./EducationalContent";

import ActivityLog from "./ActivityLog";

import Trends from "./Trends";

import AskAI from "./AskAI";

import Notifications from "./Notifications";

import Achievements from "./Achievements";

import AIImprovementPlan from "./AIImprovementPlan";

import LaunchingSoon from "./LaunchingSoon";

import AnalysisDetail from "./AnalysisDetail";

import VaccineReminders from "./VaccineReminders";

import Contact from "./Contact";

import ContactSubmissions from "./ContactSubmissions";

import BackendRequirements from "./BackendRequirements";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Analyze: Analyze,
    
    History: History,
    
    PetProfile: PetProfile,
    
    PrivacyPolicy: PrivacyPolicy,
    
    TermsOfService: TermsOfService,
    
    AITransparency: AITransparency,
    
    Settings: Settings,
    
    Landing: Landing,
    
    Home: Home,
    
    Onboarding: Onboarding,
    
    EducationalContent: EducationalContent,
    
    ActivityLog: ActivityLog,
    
    Trends: Trends,
    
    AskAI: AskAI,
    
    Notifications: Notifications,
    
    Achievements: Achievements,
    
    AIImprovementPlan: AIImprovementPlan,
    
    LaunchingSoon: LaunchingSoon,
    
    AnalysisDetail: AnalysisDetail,
    
    VaccineReminders: VaccineReminders,
    
    Contact: Contact,
    
    ContactSubmissions: ContactSubmissions,
    
    BackendRequirements: BackendRequirements,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Analyze" element={<Analyze />} />
                
                <Route path="/History" element={<History />} />
                
                <Route path="/PetProfile" element={<PetProfile />} />
                
                <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
                
                <Route path="/TermsOfService" element={<TermsOfService />} />
                
                <Route path="/AITransparency" element={<AITransparency />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Onboarding" element={<Onboarding />} />
                
                <Route path="/EducationalContent" element={<EducationalContent />} />
                
                <Route path="/ActivityLog" element={<ActivityLog />} />
                
                <Route path="/Trends" element={<Trends />} />
                
                <Route path="/AskAI" element={<AskAI />} />
                
                <Route path="/Notifications" element={<Notifications />} />
                
                <Route path="/Achievements" element={<Achievements />} />
                
                <Route path="/AIImprovementPlan" element={<AIImprovementPlan />} />
                
                <Route path="/LaunchingSoon" element={<LaunchingSoon />} />
                
                <Route path="/AnalysisDetail" element={<AnalysisDetail />} />
                
                <Route path="/VaccineReminders" element={<VaccineReminders />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/ContactSubmissions" element={<ContactSubmissions />} />
                
                <Route path="/BackendRequirements" element={<BackendRequirements />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}