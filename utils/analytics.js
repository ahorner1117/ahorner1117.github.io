/**
 * Google Tag Manager (GTM) Data Layer Utility
 *
 * This utility provides a centralized way to push events to GTM's dataLayer
 * with consistent naming conventions and type safety.
 *
 * Event naming convention: {category}_{action}_{label?}
 * Example: navigation_click, payment_form_start, project_card_click
 *
 * ANALYTICS STRATEGY OVERVIEW:
 * ============================
 * 1. User Acquisition: Track referral sources, UTM parameters, landing pages
 * 2. Engagement: Scroll depth, time on page, section visibility
 * 3. Conversion: Project views, external link clicks, contact actions
 * 4. Technical: Page performance, errors, browser/device data
 */

// ============================================================================
// CORE UTILITIES
// ============================================================================

/**
 * Pushes an event to the GTM dataLayer
 * @param {Object} event - Event object to push to dataLayer
 */
export const pushToDataLayer = (event) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
};

/**
 * Gets the current session ID or creates one
 * Used for correlating events within a single session
 */
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Gets referral and UTM data from the current URL
 * @returns {Object} Referral information
 */
export const getReferralData = () => {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const referrer = document.referrer;

  // Parse referrer domain
  let referrerDomain = 'direct';
  let referrerType = 'direct';

  if (referrer) {
    try {
      const referrerUrl = new URL(referrer);
      referrerDomain = referrerUrl.hostname;

      // Categorize referrer
      if (referrerDomain.includes('google')) referrerType = 'organic_search';
      else if (referrerDomain.includes('bing')) referrerType = 'organic_search';
      else if (referrerDomain.includes('linkedin')) referrerType = 'social';
      else if (referrerDomain.includes('github')) referrerType = 'social';
      else if (referrerDomain.includes('twitter') || referrerDomain.includes('x.com')) referrerType = 'social';
      else if (referrerDomain.includes('facebook')) referrerType = 'social';
      else referrerType = 'referral';
    } catch {
      referrerDomain = 'unknown';
    }
  }

  return {
    referrer_domain: referrerDomain,
    referrer_type: referrerType,
    referrer_full: referrer || 'direct',
    utm_source: urlParams.get('utm_source') || null,
    utm_medium: urlParams.get('utm_medium') || null,
    utm_campaign: urlParams.get('utm_campaign') || null,
    utm_term: urlParams.get('utm_term') || null,
    utm_content: urlParams.get('utm_content') || null,
    landing_page: window.location.pathname + window.location.hash,
  };
};

/**
 * Predefined event tracking functions for type safety and consistency
 */
export const trackEvent = {
  // ============================================================================
  // PAYMENT EVENTS (CRITICAL - Conversion Funnel)
  // ============================================================================

  /**
   * Track when user starts filling out the payment form
   * @param {number} amount - Initial amount entered
   */
  paymentFormStart: (amount) => {
    pushToDataLayer({
      event: 'payment_form_start',
      event_category: 'payment',
      event_action: 'form_start',
      payment_amount: amount,
    });
  },

  /**
   * Track payment form field changes (for funnel analysis)
   * @param {string} fieldName - Name of the field that changed
   * @param {boolean} hasValue - Whether the field has a value (avoid PII)
   */
  paymentFormFieldChange: (fieldName, hasValue) => {
    pushToDataLayer({
      event: 'payment_form_field',
      event_category: 'payment',
      event_action: 'field_change',
      field_name: fieldName,
      field_has_value: hasValue,
    });
  },

  /**
   * Track payment form submission
   * @param {number} amount - Payment amount
   * @param {string} email - User email (will be hashed in GTM if needed)
   * @param {boolean} hasInvoice - Whether invoice number was provided
   * @param {boolean} hasDescription - Whether description was provided
   */
  paymentFormSubmit: (amount, email, hasInvoice, hasDescription) => {
    pushToDataLayer({
      event: 'payment_form_submit',
      event_category: 'payment',
      event_action: 'form_submit',
      payment_amount: amount,
      has_invoice_number: hasInvoice,
      has_description: hasDescription,
      // Email is included for GA4 user tracking but should be hashed in GTM if needed
    });
  },

  /**
   * Track successful payment completion
   * @param {string} sessionId - Stripe session ID
   */
  paymentSuccess: (sessionId) => {
    pushToDataLayer({
      event: 'payment_success',
      event_category: 'payment',
      event_action: 'success',
      session_id: sessionId,
      value: 1, // Conversion value for GA4
    });
  },

  /**
   * Track payment cancellation
   */
  paymentCancel: () => {
    pushToDataLayer({
      event: 'payment_cancel',
      event_category: 'payment',
      event_action: 'cancel',
    });
  },

  /**
   * Track payment form errors (validation or API)
   * @param {string} errorMessage - Error message
   */
  paymentError: (errorMessage) => {
    pushToDataLayer({
      event: 'payment_error',
      event_category: 'payment',
      event_action: 'error',
      error_message: errorMessage,
    });
  },

  // ============================================================================
  // PROJECT EVENTS (High Priority - Engagement Tracking)
  // ============================================================================

  /**
   * Track project card click
   * @param {string} projectTitle - Title of the project
   * @param {string} projectType - Type of project ('ecommerce' or 'personal')
   */
  projectCardClick: (projectTitle, projectType) => {
    pushToDataLayer({
      event: 'project_card_click',
      event_category: 'project',
      event_action: 'card_click',
      project_title: projectTitle,
      project_type: projectType,
    });
  },

  /**
   * Track project modal open
   * @param {string} projectTitle - Title of the project
   */
  projectModalOpen: (projectTitle) => {
    pushToDataLayer({
      event: 'project_modal_open',
      event_category: 'project',
      event_action: 'modal_open',
      project_title: projectTitle,
    });
  },

  /**
   * Track project modal close with time spent
   * @param {string} projectTitle - Title of the project
   * @param {number} timeSpent - Time spent viewing project in seconds
   */
  projectModalClose: (projectTitle, timeSpent) => {
    pushToDataLayer({
      event: 'project_modal_close',
      event_category: 'project',
      event_action: 'modal_close',
      project_title: projectTitle,
      time_spent_seconds: timeSpent,
    });
  },

  /**
   * Track external project link clicks
   * @param {string} projectTitle - Title of the project
   * @param {string} url - Destination URL
   */
  projectExternalLink: (projectTitle, url) => {
    pushToDataLayer({
      event: 'project_external_link',
      event_category: 'project',
      event_action: 'external_link_click',
      project_title: projectTitle,
      destination_url: url,
    });
  },

  // ============================================================================
  // NAVIGATION EVENTS (High Priority - User Journey)
  // ============================================================================

  /**
   * Track navigation menu clicks
   * @param {string} label - Menu item label/title
   * @param {string} destination - Destination URL or anchor
   */
  navigationClick: (label, destination) => {
    pushToDataLayer({
      event: 'navigation_click',
      event_category: 'navigation',
      event_action: 'click',
      event_label: label,
      destination_url: destination,
    });
  },

  /**
   * Track mobile menu toggle
   * @param {string} action - 'open' or 'close'
   */
  mobileMenuToggle: (action) => {
    pushToDataLayer({
      event: 'mobile_menu_toggle',
      event_category: 'navigation',
      event_action: action,
    });
  },

  // ============================================================================
  // UI INTERACTION EVENTS (Medium Priority)
  // ============================================================================

  /**
   * Track theme toggle
   * @param {string} newTheme - Theme selected ('dark' or 'light')
   */
  themeToggle: (newTheme) => {
    pushToDataLayer({
      event: 'theme_toggle',
      event_category: 'ui',
      event_action: 'theme_change',
      theme_selected: newTheme,
    });
  },

  /**
   * Track social media link clicks
   * @param {string} platform - Social platform ID (e.g., 'github', 'email')
   * @param {string} url - Destination URL
   */
  socialMediaClick: (platform, url) => {
    pushToDataLayer({
      event: 'social_media_click',
      event_category: 'social',
      event_action: 'click',
      social_platform: platform,
      destination_url: url,
    });
  },

  /**
   * Track scroll to top button click
   */
  scrollToTop: () => {
    pushToDataLayer({
      event: 'scroll_to_top',
      event_category: 'ui',
      event_action: 'scroll_top_click',
    });
  },

  /**
   * Track about section tab toggle
   * @param {string} tabName - Tab that was selected
   */
  aboutTabToggle: (tabName) => {
    pushToDataLayer({
      event: 'about_tab_toggle',
      event_category: 'ui',
      event_action: 'tab_change',
      tab_name: tabName,
    });
  },

  // ============================================================================
  // SESSION & REFERRAL EVENTS (User Acquisition)
  // ============================================================================

  /**
   * Track session start with referral data
   * Call this on initial page load
   */
  sessionStart: () => {
    const referralData = getReferralData();
    const sessionId = getSessionId();

    pushToDataLayer({
      event: 'session_start',
      event_category: 'session',
      event_action: 'start',
      session_id: sessionId,
      ...referralData,
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      device_type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track page view with context
   * @param {string} pagePath - Current page path
   * @param {string} pageTitle - Current page title
   */
  pageView: (pagePath, pageTitle) => {
    pushToDataLayer({
      event: 'page_view_custom',
      event_category: 'session',
      event_action: 'page_view',
      page_path: pagePath,
      page_title: pageTitle,
      session_id: getSessionId(),
    });
  },

  // ============================================================================
  // SCROLL DEPTH TRACKING (Engagement)
  // ============================================================================

  /**
   * Track scroll depth milestones
   * @param {number} percentage - Scroll depth percentage (25, 50, 75, 100)
   */
  scrollDepth: (percentage) => {
    pushToDataLayer({
      event: 'scroll_depth',
      event_category: 'engagement',
      event_action: 'scroll',
      scroll_percentage: percentage,
      session_id: getSessionId(),
    });
  },

  /**
   * Track section visibility (when user scrolls to a section)
   * @param {string} sectionId - ID of the section
   * @param {string} sectionName - Human-readable section name
   */
  sectionView: (sectionId, sectionName) => {
    pushToDataLayer({
      event: 'section_view',
      event_category: 'engagement',
      event_action: 'section_visible',
      section_id: sectionId,
      section_name: sectionName,
      session_id: getSessionId(),
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track time spent on a section
   * @param {string} sectionId - ID of the section
   * @param {number} timeSpent - Time in seconds
   */
  sectionEngagement: (sectionId, timeSpent) => {
    pushToDataLayer({
      event: 'section_engagement',
      event_category: 'engagement',
      event_action: 'time_spent',
      section_id: sectionId,
      time_spent_seconds: timeSpent,
    });
  },

  // ============================================================================
  // CLICK TRACKING (Detailed Interaction)
  // ============================================================================

  /**
   * Track any outbound link click
   * @param {string} url - Destination URL
   * @param {string} linkText - Text of the link
   * @param {string} context - Where the link was clicked from
   */
  outboundClick: (url, linkText, context) => {
    pushToDataLayer({
      event: 'outbound_click',
      event_category: 'clicks',
      event_action: 'outbound',
      destination_url: url,
      link_text: linkText,
      click_context: context,
    });
  },

  /**
   * Track CTA button clicks
   * @param {string} ctaName - Name/ID of the CTA
   * @param {string} ctaText - Button text
   * @param {string} location - Where on the page
   */
  ctaClick: (ctaName, ctaText, location) => {
    pushToDataLayer({
      event: 'cta_click',
      event_category: 'clicks',
      event_action: 'cta',
      cta_name: ctaName,
      cta_text: ctaText,
      cta_location: location,
    });
  },

  /**
   * Track resume/CV downloads
   */
  resumeDownload: () => {
    pushToDataLayer({
      event: 'resume_download',
      event_category: 'conversion',
      event_action: 'download',
      file_type: 'resume',
    });
  },

  /**
   * Track email link clicks (intent to contact)
   * @param {string} source - Where the email link was clicked
   */
  emailIntent: (source) => {
    pushToDataLayer({
      event: 'email_intent',
      event_category: 'conversion',
      event_action: 'contact_intent',
      contact_source: source,
    });
  },

  // ============================================================================
  // TECHNOLOGY SECTION EVENTS
  // ============================================================================

  /**
   * Track technology item interaction
   * @param {string} techName - Name of the technology
   * @param {string} category - Technology category
   */
  technologyView: (techName, category) => {
    pushToDataLayer({
      event: 'technology_view',
      event_category: 'engagement',
      event_action: 'tech_interaction',
      technology_name: techName,
      technology_category: category,
    });
  },

  // ============================================================================
  // PERFORMANCE & ERROR TRACKING
  // ============================================================================

  /**
   * Track page performance metrics
   * @param {Object} metrics - Performance metrics object
   */
  pagePerformance: (metrics) => {
    pushToDataLayer({
      event: 'page_performance',
      event_category: 'technical',
      event_action: 'performance',
      ...metrics,
    });
  },

  /**
   * Track JavaScript errors
   * @param {string} errorMessage - Error message
   * @param {string} errorSource - Source file
   * @param {number} errorLine - Line number
   */
  jsError: (errorMessage, errorSource, errorLine) => {
    pushToDataLayer({
      event: 'js_error',
      event_category: 'technical',
      event_action: 'error',
      error_message: errorMessage,
      error_source: errorSource,
      error_line: errorLine,
    });
  },

  // ============================================================================
  // EXIT INTENT TRACKING
  // ============================================================================

  /**
   * Track exit intent (mouse leaving viewport)
   * @param {number} timeOnPage - Time spent on page in seconds
   * @param {number} scrollDepth - Final scroll depth percentage
   */
  exitIntent: (timeOnPage, scrollDepth) => {
    pushToDataLayer({
      event: 'exit_intent',
      event_category: 'engagement',
      event_action: 'exit_intent_detected',
      time_on_page_seconds: timeOnPage,
      final_scroll_depth: scrollDepth,
    });
  },
};

// ============================================================================
// ANALYTICS INITIALIZATION & AUTOMATED TRACKING
// ============================================================================

/**
 * Initialize scroll depth tracking
 * Tracks when user reaches 25%, 50%, 75%, and 100% of page
 */
export const initScrollDepthTracking = () => {
  if (typeof window === 'undefined') return;

  const trackedDepths = new Set();
  const depthMilestones = [25, 50, 75, 100];

  const calculateScrollDepth = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 100;
    return Math.round((scrollTop / docHeight) * 100);
  };

  const handleScroll = () => {
    const currentDepth = calculateScrollDepth();

    depthMilestones.forEach((milestone) => {
      if (currentDepth >= milestone && !trackedDepths.has(milestone)) {
        trackedDepths.add(milestone);
        trackEvent.scrollDepth(milestone);
      }
    });
  };

  // Throttle scroll handler for performance
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
};

/**
 * Initialize section visibility tracking using Intersection Observer
 * @param {Array<{id: string, name: string}>} sections - Sections to track
 */
export const initSectionTracking = (sections) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const viewedSections = new Set();
  const sectionTimers = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return;

        if (entry.isIntersecting) {
          // Track first view
          if (!viewedSections.has(sectionId)) {
            viewedSections.add(sectionId);
            trackEvent.sectionView(sectionId, section.name);
          }

          // Start timer for engagement tracking
          sectionTimers.set(sectionId, Date.now());
        } else {
          // Track time spent when leaving section
          const startTime = sectionTimers.get(sectionId);
          if (startTime) {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            if (timeSpent > 2) {
              // Only track if > 2 seconds
              trackEvent.sectionEngagement(sectionId, timeSpent);
            }
            sectionTimers.delete(sectionId);
          }
        }
      });
    },
    {
      threshold: 0.3, // 30% of section visible
      rootMargin: '-50px 0px -50px 0px',
    }
  );

  // Observe each section
  sections.forEach(({ id }) => {
    const element = document.getElementById(id);
    if (element) observer.observe(element);
  });

  return observer;
};

/**
 * Initialize exit intent tracking
 */
export const initExitIntentTracking = () => {
  if (typeof window === 'undefined') return;

  let exitTracked = false;
  const pageLoadTime = Date.now();

  const calculateScrollDepth = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 100;
    return Math.round((scrollTop / docHeight) * 100);
  };

  document.addEventListener('mouseleave', (e) => {
    // Only trigger when mouse leaves from top of viewport
    if (e.clientY <= 0 && !exitTracked) {
      exitTracked = true;
      const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);
      trackEvent.exitIntent(timeOnPage, calculateScrollDepth());
    }
  });
};

/**
 * Initialize performance tracking
 * Uses Performance API to track Core Web Vitals
 */
export const initPerformanceTracking = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Wait for page to fully load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = performance.timing;
      const navigation = performance.getEntriesByType('navigation')[0];

      const metrics = {
        page_load_time: timing.loadEventEnd - timing.navigationStart,
        dom_interactive: timing.domInteractive - timing.navigationStart,
        dom_complete: timing.domComplete - timing.navigationStart,
        first_paint: 0,
        first_contentful_paint: 0,
      };

      // Get paint timings
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-paint') {
          metrics.first_paint = Math.round(entry.startTime);
        }
        if (entry.name === 'first-contentful-paint') {
          metrics.first_contentful_paint = Math.round(entry.startTime);
        }
      });

      // Get LCP if available
      if (navigation && navigation.largestContentfulPaint) {
        metrics.largest_contentful_paint = Math.round(navigation.largestContentfulPaint);
      }

      trackEvent.pagePerformance(metrics);
    }, 0);
  });
};

/**
 * Initialize error tracking
 */
export const initErrorTracking = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    trackEvent.jsError(
      event.message,
      event.filename || 'unknown',
      event.lineno || 0
    );
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackEvent.jsError(
      `Unhandled Promise Rejection: ${event.reason}`,
      'promise',
      0
    );
  });
};

/**
 * Initialize all analytics tracking
 * Call this once on app mount
 * @param {Array<{id: string, name: string}>} sections - Sections to track
 */
export const initAnalytics = (sections = []) => {
  if (typeof window === 'undefined') return;

  // Track session start
  trackEvent.sessionStart();

  // Initialize all tracking modules
  initScrollDepthTracking();
  initExitIntentTracking();
  initPerformanceTracking();
  initErrorTracking();

  // Initialize section tracking if sections provided
  if (sections.length > 0) {
    initSectionTracking(sections);
  }

  // Track initial page view
  trackEvent.pageView(window.location.pathname + window.location.hash, document.title);
};
