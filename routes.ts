/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
  "/",
  "/new-verification",
  "/api/cron",
  "/api/meli",
  "/products",
  "/products/local",
  "/privacy-policy",
  "/profile/business",
];

/**
 * Public route prefixes for dynamic segments
 * @type {string[]}
 */
export const publicRoutePrefixes = [
  "/products/",
  "/products/internacional/",
  "/products/international/",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */

export const authRoutes = [
  "/sign-in",
  "/sign-up",
  "/error",
  "/reset",
  "/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/profile/business";
