const LOCAL_API_BASE_URL = "http://localhost:5000";
const RENDER_API_BASE_URL = "https://koinxassign.onrender.com";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? LOCAL_API_BASE_URL : RENDER_API_BASE_URL);
