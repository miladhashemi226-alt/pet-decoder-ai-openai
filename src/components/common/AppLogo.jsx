import React from "react";
import { PawPrint } from "lucide-react";

// SVG Favicon Generator - Creates a paw print logo matching the app design
export const generateFaviconSVG = () => {
  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#grad1)"/>
      
      <!-- Paw print - main pad -->
      <ellipse cx="32" cy="38" rx="8" ry="10" fill="white" opacity="0.95"/>
      
      <!-- Paw print - toe pads -->
      <ellipse cx="22" cy="26" rx="4.5" ry="6" fill="white" opacity="0.95" transform="rotate(-15 22 26)"/>
      <ellipse cx="30" cy="22" rx="4.5" ry="6" fill="white" opacity="0.95" transform="rotate(-5 30 22)"/>
      <ellipse cx="38" cy="22" rx="4.5" ry="6" fill="white" opacity="0.95" transform="rotate(5 38 22)"/>
      <ellipse cx="46" cy="26" rx="4.5" ry="6" fill="white" opacity="0.95" transform="rotate(15 46 26)"/>
    </svg>
  `;
  return svg;
};

// Convert SVG to data URL for favicon
export const generateFaviconDataURL = () => {
  const svg = generateFaviconSVG();
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// App Logo Component - simple PawPrint icon with gradient background
export default function AppLogo({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg ${className}`}>
      <PawPrint className={`${iconSizes[size]} text-white`} />
    </div>
  );
}