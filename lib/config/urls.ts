const DEFAULT_DEVELOPMENT_URL = "http://localhost:3000";
const DEFAULT_PRODUCTION_URL = "https://savemelin.com";

export const APP_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_APP_BASE_URL || DEFAULT_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL || DEFAULT_PRODUCTION_URL;

