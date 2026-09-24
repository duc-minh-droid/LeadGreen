import React from "react";
import { BACKEND_URL } from "../../config";
import { motion, AnimatePresence } from "framer-motion";
import InsectDisplay from "./InsectDisplay";

const PlantDisplay = ({ plantRef, wiggle, scale, plantImage, plantName, insect, onClick, floaters = [], hint }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <motion.div
        ref={plantRef}
        animate={wiggle ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative sm:mt-8 md:mt-10 lg:mt-12 cursor-pointer"
        onClick={onClick}
        style={{ userSelect: "none" }}
      >
        {/* soft shadow under the pot */}
        <motion.div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-36 h-6 rounded-[50%] bg-green-900/20 blur-md"
          animate={{ scaleX: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* gentle idle sway, pivoting at the pot */}
        <motion.div
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "50% 100%" }}
        >
          <AnimatePresence mode="popLayout">
            <motion.img
              key={plantImage}
              src={BACKEND_URL + plantImage}
              alt={plantName}
              className="w-[150px] h-[150px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] -mt-20"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale, opacity: 1 }}
              exit={{ scale: scale * 1.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 10 }}
              draggable={false}
            />
          </AnimatePresence>
        </motion.div>
        <InsectDisplay insect={insect} />

        <AnimatePresence>
          {floaters.map((f, i) => (
            <motion.div
              key={f.id}
              className="absolute inset-x-0 mx-auto w-fit -top-16 pointer-events-none whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-green-700 shadow-md"
              initial={{ y: 20, opacity: 0, scale: 0.6 }}
              animate={{ y: -60 - i * 12, opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              {f.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hint && (
        <AnimatePresence mode="wait">
          <motion.p
            key={hint}
            className="mt-8 rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-sm font-semibold text-green-800 shadow whitespace-nowrap"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
          >
            {hint}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
};

export default PlantDisplay;
