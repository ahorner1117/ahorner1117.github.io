/**
 * Google Tag Manager (GTM) Data Layer Utility
 *
 * This utility provides a centralized way to push events to GTM's dataLayer
 * with consistent naming conventions and type safety.
 *
 * Event naming convention: {category}_{action}_{label?}
 * Example: navigation_click, payment_form_start, project_card_click
 */

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
};
