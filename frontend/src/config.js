// Central place for the backend URL and the demo-mode switch.
// Demo mode is on when VITE_DEMO_MODE=true or when no VITE_BACKEND is configured
// (e.g. a static Vercel deploy). In demo mode every /api call is answered in the
// browser by src/demo/demoApi.js and media is served from /public/media.
export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE === "true" || !import.meta.env.VITE_BACKEND;

export const BACKEND_URL = DEMO_MODE ? "" : import.meta.env.VITE_BACKEND.replace(/\/$/, "");
