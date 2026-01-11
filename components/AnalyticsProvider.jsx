"use client";

import { useEffect, useRef } from "react";
import { initAnalytics, trackEvent } from "utils/analytics";

/**
 * Sections to track for visibility and engagement
 * Maps section IDs to human-readable names for analytics
 */
const TRACKED_SECTIONS = [
  { id: "intro", name: "Welcome/Intro" },
  { id: "about", name: "About Me" },
  { id: "projects", name: "Projects" },
  { id: "timeline", name: "Timeline/Experience" },
  { id: "ai", name: "AI Section" },
  { id: "tech", name: "Technologies" },
];

/**
 * AnalyticsProvider Component
 *
 * Initializes comprehensive analytics tracking on mount:
 * - Session start with referral data
 * - Scroll depth tracking (25%, 50%, 75%, 100%)
 * - Section visibility tracking
 * - Exit intent detection
 * - Performance metrics
 * - Error tracking
 *
 * Usage: Wrap your app or include once in the root layout
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export default function AnalyticsProvider({ children }) {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initialized.current) return;
    initialized.current = true;

    // Initialize all analytics tracking
    initAnalytics(TRACKED_SECTIONS);

    // Track when user is about to leave (before unload)
    const handleBeforeUnload = () => {
      // Calculate final engagement metrics
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const finalScrollDepth =
        docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 100;

      // Use sendBeacon for reliable tracking on page exit
      if (navigator.sendBeacon && window.dataLayer) {
        const exitData = {
          event: "page_exit",
          event_category: "engagement",
          event_action: "page_unload",
          final_scroll_depth: finalScrollDepth,
          timestamp: new Date().toISOString(),
        };

        // Push to dataLayer (GTM will handle it)
        window.dataLayer.push(exitData);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return children;
}

/**
 * Hook for tracking outbound links
 * Wraps link clicks with analytics tracking
 *
 * @param {string} context - Where the link is located (e.g., "footer", "project_card")
 * @returns {Function} Click handler to use on links
 *
 * @example
 * const trackClick = useOutboundLinkTracking("footer");
 * <a href="https://example.com" onClick={(e) => trackClick(e, "Visit Example")}>
 */
export function useOutboundLinkTracking(context) {
  return (event, linkText = "") => {
    const href = event.currentTarget?.href;
    if (href && !href.startsWith(window.location.origin)) {
      trackEvent.outboundClick(href, linkText || event.currentTarget.innerText, context);
    }
  };
}

/**
 * Hook for tracking CTA button clicks
 *
 * @param {string} ctaName - Unique identifier for the CTA
 * @param {string} location - Where the CTA is on the page
 * @returns {Function} Click handler
 *
 * @example
 * const trackCTA = useCTATracking("hire_me", "hero_section");
 * <button onClick={trackCTA}>Hire Me</button>
 */
export function useCTATracking(ctaName, location) {
  return (event) => {
    const buttonText = event.currentTarget?.innerText || ctaName;
    trackEvent.ctaClick(ctaName, buttonText, location);
  };
}

/**
 * Hook for tracking technology interactions
 *
 * @returns {Function} Handler for technology item interactions
 *
 * @example
 * const trackTech = useTechnologyTracking();
 * <div onMouseEnter={() => trackTech("React", "Frontend")}>React</div>
 */
export function useTechnologyTracking() {
  const trackedTechs = useRef(new Set());

  return (techName, category) => {
    // Only track first interaction with each technology
    if (!trackedTechs.current.has(techName)) {
      trackedTechs.current.add(techName);
      trackEvent.technologyView(techName, category);
    }
  };
}
