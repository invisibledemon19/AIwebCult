/**
 * sheetsService.js
 * 
 * Middleware client for asynchronous communication between Vite and Google Sheets.
 * Dispatches JSON payloads to a Google Apps Script Web App URL, keeping all credentials
 * completely out of the client-side bundle.
 */

const APPS_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbx_MOCK_APPS_SCRIPT_ENDPOINT_M47A/exec";

/**
 * Low-level dispatch function.
 * Uses 'text/plain' Content-Type to avoid CORS preflight issues with Google's servers,
 * which standard Google Apps Script doPost(e) parses via e.postData.contents.
 *
 * @param {Object} payload - Data payload to transmit
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const postToGoogleSheets = async (payload) => {
  const enrichedPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    origin: window.location.origin,
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      // Crucial: text/plain prevents CORS preflight OPTIONS rejection from Google Apps Script
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(enrichedPayload),
      redirect: "follow",
    });

    // Check if response returned readable JSON
    if (response.ok) {
      try {
        const json = await response.json();
        return { success: true, data: json };
      } catch {
        // Some Google Apps Script deployments respond with redirect HTML text
        return { success: true, message: "RECORD_INGESTED_VIA_STREAM" };
      }
    }

    return {
      success: false,
      error: `DISPATCH_HTTP_ERROR_${response.status}`,
    };
  } catch (error) {
    console.error("[SHEETS_MIDDLEWARE_ERROR] Failed to post record to Google Sheets:", error);

    // Fallback: Attempt fire-and-forget with no-cors mode if strict policy blocks standard fetch
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(enrichedPayload),
      });
      return { success: true, message: "RECORD_DISPATCHED_NO_CORS" };
    } catch (fallbackError) {
      return {
        success: false,
        error: fallbackError.message || "NETWORK_TRANSMISSION_FAILED",
      };
    }
  }
};

/**
 * Logs Firebase user signup / authentication event into the 'Auth_Log' tab.
 * Mandated by architecture.md: UID is passed to Google Sheets to log user signup.
 *
 * @param {Object} params
 * @param {string} params.uid - Firebase User ID
 * @param {string|null} [params.email] - User email
 * @param {string|null} [params.phoneNumber] - User phone number
 * @param {string} [params.authMethod] - 'PHONE_OTP' | 'EMAIL_LINK'
 */
export const logAuthSignup = async ({ uid, email = null, phoneNumber = null, authMethod = "OTP" }) => {
  return await postToGoogleSheets({
    action: "LOG_AUTH_SIGNUP",
    sheetTab: "Auth_Log",
    uid,
    email,
    phoneNumber,
    authMethod,
  });
};

/**
 * Submits contact or customer service forms into the 'Submissions' tab.
 *
 * @param {Object} formData
 * @param {string} formData.name
 * @param {string} formData.email
 * @param {string} formData.projectScope
 * @param {string} [formData.budget]
 */
export const submitContactForm = async (formData) => {
  return await postToGoogleSheets({
    action: "SUBMIT_CONTACT",
    sheetTab: "Submissions",
    ...formData,
  });
};

/**
 * Submits customer reviews or feedback into the 'Reviews' tab.
 *
 * @param {Object} reviewData
 * @param {string} reviewData.author
 * @param {string} reviewData.role
 * @param {string} reviewData.company
 * @param {string} reviewData.body
 * @param {number} [reviewData.rating]
 */
export const submitReview = async (reviewData) => {
  return await postToGoogleSheets({
    action: "SUBMIT_REVIEW",
    sheetTab: "Reviews",
    ...reviewData,
  });
};

export default {
  postToGoogleSheets,
  logAuthSignup,
  submitContactForm,
  submitReview,
};

