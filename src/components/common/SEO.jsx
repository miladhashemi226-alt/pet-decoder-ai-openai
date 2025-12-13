import React, { useEffect } from "react";
import { generateFaviconDataURL } from "./AppLogo";

export default function SEO({
  title = "Pet Decoder AI - Understand Your Pet's Behavior with AI",
  description = "AI-powered pet behavior analysis. Upload photos or videos and get instant insights into your pet's emotions, body language, and behavioral patterns.",
  keywords = "pet behavior analysis, AI pet decoder, pet emotions, dog behavior, cat behavior, pet AI, animal behavior analysis, pet psychology",
  ogImage = "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=630&fit=crop",
  ogType = "website",
  canonicalUrl,
  noIndex = true,
  author = "Milad H., Pet Decoder AI",
  schema
}) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attribute, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) {
          element.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
        } else if (selector.includes('name=')) {
          element.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update favicon
    const faviconDataURL = generateFaviconDataURL();
    
    let faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.setAttribute('rel', 'icon');
      document.head.appendChild(faviconLink);
    }
    faviconLink.setAttribute('type', 'image/svg+xml');
    faviconLink.setAttribute('href', faviconDataURL);

    let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      appleTouchIcon = document.createElement('link');
      appleTouchIcon.setAttribute('rel', 'apple-touch-icon');
      document.head.appendChild(appleTouchIcon);
    }
    appleTouchIcon.setAttribute('href', faviconDataURL);

    const sizes = ['16x16', '32x32', '96x96', '192x192'];
    sizes.forEach(size => {
      let sizedIcon = document.querySelector(`link[rel="icon"][sizes="${size}"]`);
      if (!sizedIcon) {
        sizedIcon = document.createElement('link');
        sizedIcon.setAttribute('rel', 'icon');
        sizedIcon.setAttribute('type', 'image/svg+xml');
        sizedIcon.setAttribute('sizes', size);
        document.head.appendChild(sizedIcon);
      }
      sizedIcon.setAttribute('href', faviconDataURL);
    });

    updateMetaTag('meta[name="theme-color"]', 'name', '#8b5cf6');
    updateMetaTag('meta[name="msapplication-TileColor"]', 'name', '#8b5cf6');
    updateMetaTag('meta[name="description"]', 'name', description);
    updateMetaTag('meta[name="keywords"]', 'name', keywords);
    updateMetaTag('meta[name="author"]', 'name', author);
    updateMetaTag('meta[name="robots"]', 'name', noIndex ? 'noindex, nofollow' : 'index, follow');

    updateMetaTag('meta[property="og:title"]', 'property', title);
    updateMetaTag('meta[property="og:description"]', 'property', description);
    updateMetaTag('meta[property="og:image"]', 'property', ogImage);
    updateMetaTag('meta[property="og:type"]', 'property', ogType);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'Pet Decoder AI');
    if (canonicalUrl) {
      updateMetaTag('meta[property="og:url"]', 'property', canonicalUrl);
    }

    updateMetaTag('meta[name="twitter:card"]', 'name', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', ogImage);

    if (canonicalUrl) {
      let linkElement = document.querySelector('link[rel="canonical"]');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'canonical');
        document.head.appendChild(linkElement);
      }
      linkElement.setAttribute('href', canonicalUrl);
    }

    if (schema) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(schema);
    }

    // Remove any Meta Pixel scripts that may have been added
    const removeMetaPixel = () => {
      const fbScripts = document.querySelectorAll('script[src*="facebook"], script[src*="fbevents"]');
      fbScripts.forEach(script => script.remove());
      
      if (window.fbq) {
        delete window.fbq;
        delete window._fbq;
      }
    };
    
    removeMetaPixel();

  }, [title, description, keywords, ogImage, ogType, canonicalUrl, noIndex, author, schema]);

  return null;
}