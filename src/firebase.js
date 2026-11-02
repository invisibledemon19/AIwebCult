import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";

// Read from Vite environment variables (VITE_ prefix required)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevOnly_12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aiwebcult-mvp.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aiwebcult-mvp",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aiwebcult-mvp.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const AUTH_STORAGE_KEY = "aiwebcult_session";

/**
 * Persists authenticated user session to localStorage as mandated by architecture.md
 */
export const persistSession = (user) => {
  if (!user) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  const sessionData = {
    uid: user.uid,
    email: user.email,
    phoneNumber: user.phoneNumber,
    token: user.accessToken,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
};

export const getCachedSession = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * -------------------------------------------------------------
 * 1. PHONE NUMBER OTP AUTHENTICATION
 * -------------------------------------------------------------
 */

/**
 * Initializes invisible or visible reCAPTCHA container for Phone Auth
 * @param {string} containerId - DOM element ID for reCAPTCHA widget
 */
export const initRecaptchaVerifier = (containerId = "recaptcha-container") => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.info("[RECAPTCHA] Verification completed successfully.");
    },
    "expired-callback": () => {
      console.warn("[RECAPTCHA] Verification token expired. Re-initializing.");
    },
  });

  return window.recaptchaVerifier;
};

/**
 * Dispatches OTP to phone number using Firebase Auth
 * @param {string} phoneNumber - E.164 formatted phone number (e.g., +15551234567)
 * @param {string} containerId - Target element ID for reCAPTCHA
 */
export const sendPhoneOtp = async (phoneNumber, containerId = "recaptcha-container") => {
  try {
    const verifier = initRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    window.confirmationResult = confirmationResult;
    return {
      success: true,
      message: "PHONE_OTP_DISPATCHED",
      confirmationResult,
    };
  } catch (error) {
    console.error("[AUTH_ERROR] sendPhoneOtp failed:", error);
    return {
      success: false,
      message: error.message || "OTP_TRANSMISSION_FAILED",
      error,
    };
  }
};

/**
 * Verifies submitted 6-digit phone OTP
 * @param {string} otpCode - 6-digit numeric verification code
 */
export const verifyPhoneOtp = async (otpCode) => {
  if (!window.confirmationResult) {
    return {
      success: false,
      message: "CONFIRMATION_SESSION_LOST",
    };
  }

  try {
    const userCredential = await window.confirmationResult.confirm(otpCode);
    const user = userCredential.user;
    persistSession(user);

    return {
      success: true,
      user,
      uid: user.uid,
    };
  } catch (error) {
    console.error("[AUTH_ERROR] verifyPhoneOtp failed:", error);
    return {
      success: false,
      message: error.message || "INVALID_VERIFICATION_TOKEN",
      error,
    };
  }
};

/**
 * -------------------------------------------------------------
 * 2. EMAIL LINK PASSWORDLESS OTP AUTHENTICATION
 * -------------------------------------------------------------
 */

/**
 * Sends a passwordless sign-in link to user's email
 * @param {string} email - Destination email address
 */
export const sendEmailOtpLink = async (email) => {
  const actionCodeSettings = {
    // Current URL or designated auth callback route
    url: window.location.origin + "/auth-callback",
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Cache email in localStorage to finalize sign-in upon redirect
    window.localStorage.setItem("emailForSignIn", email);

    return {
      success: true,
      message: "EMAIL_LINK_DISPATCHED",
    };
  } catch (error) {
    console.error("[AUTH_ERROR] sendEmailOtpLink failed:", error);
    return {
      success: false,
      message: error.message || "EMAIL_LINK_TRANSMISSION_FAILED",
      error,
    };
  }
};

/**
 * Verifies email sign-in link when user clicks through the link
 * @param {string} [email] - User email (optional if stored in localStorage)
 * @param {string} [link] - Full callback URL (defaults to window.location.href)
 */
export const verifyEmailOtpLink = async (email, link = window.location.href) => {
  if (!isSignInWithEmailLink(auth, link)) {
    return {
      success: false,
      message: "URL_IS_NOT_AN_EMAIL_AUTH_LINK",
    };
  }

  let targetEmail = email || window.localStorage.getItem("emailForSignIn");

  if (!targetEmail) {
    targetEmail = window.prompt("[SECURITY] Verify authorization email specification:");
  }

  try {
    const result = await signInWithEmailLink(auth, targetEmail, link);
    window.localStorage.removeItem("emailForSignIn");
    persistSession(result.user);

    return {
      success: true,
      user: result.user,
      uid: result.user.uid,
    };
  } catch (error) {
    console.error("[AUTH_ERROR] verifyEmailOtpLink failed:", error);
    return {
      success: false,
      message: error.message || "SIGN_IN_WITH_LINK_FAILED",
      error,
    };
  }
};

/**
 * Signs user out and flushes cached session
 */
export const logOut = async () => {
  await firebaseSignOut(auth);
  persistSession(null);
};

/**
 * Auth state change listener with automatic session synchronization
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    persistSession(user);
    callback(user);
  });
};

export default {
  auth,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendEmailOtpLink,
  verifyEmailOtpLink,
  logOut,
  getCachedSession,
  subscribeToAuthChanges,
};

