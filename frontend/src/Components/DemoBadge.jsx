import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, RotateCcw } from "lucide-react";
import { DEMO_MODE } from "../config";
import { resetDemo } from "../demo/demoApi";

// Always-visible label so nobody mistakes the static demo for the live service.
export default function DemoBadge() {
  const [open, setOpen] = useState(false);
  if (!DEMO_MODE) return null;

  const reset = () => {
    resetDemo();
    try {
      localStorage.removeItem("authTokens");
      localStorage.removeItem("user");
    } catch {
      /* ignore */
    }
    window.location.assign("/");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-72 rounded-2xl bg-white p-4 text-sm text-gray-700 shadow-2xl ring-1 ring-amber-200"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            <p className="font-semibold text-gray-900">You are viewing a demo</p>
            <p className="mt-1">
              There is no server behind this page. Every API call is answered in your browser with
              canned data, and your progress is saved in local storage. Any username and password will log you in.
            </p>
            <button
              onClick={reset}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 font-semibold text-amber-900 hover:bg-amber-200"
            >
              <RotateCcw size={14} /> Reset demo data
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-amber-950 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <FlaskConical size={14} /> Demo mode
      </motion.button>
    </div>
  );
}
