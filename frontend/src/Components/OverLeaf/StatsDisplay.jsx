import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const StatsDisplay = ({ user }) => {
  if (!user) return null;
  const growth = Math.max(0, Math.min(1, user.growth ?? 0));

  return (
    <div className="bg-white/85 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg ring-1 ring-green-100 w-[190px] sm:w-[220px]">
      <p className="text-xs uppercase tracking-wider text-green-600 font-semibold">Your plant</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={user.plant_name}
          className="text-[#1B6630] text-lg font-bold leading-tight"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
        >
          🌿 {user.plant_name}
        </motion.p>
      </AnimatePresence>

      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#1B6630]">
        <span>Level {Math.floor(user.tree_level)}</span>
        <span>{Math.round(growth * 100)}%</span>
      </div>
      <div className="mt-1 h-2.5 rounded-full bg-green-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-lime-400 via-green-500 to-emerald-600"
          initial={false}
          animate={{ width: `${Math.max(4, growth * 100)}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-[#1B6630] font-semibold">💰 Points</span>
        <motion.span
          key={user.points_balance}
          className="text-base font-bold text-[#1B6630] tabular-nums"
          initial={{ scale: 1.35, color: "#16a34a" }}
          animate={{ scale: 1, color: "#1B6630" }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {user.points_balance}
        </motion.span>
      </div>
    </div>
  );
};

export default StatsDisplay;
