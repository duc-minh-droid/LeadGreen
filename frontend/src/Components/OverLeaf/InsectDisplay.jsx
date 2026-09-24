import React from "react";
import { BACKEND_URL } from "../../config";
import { motion } from "framer-motion";

const InsectDisplay = ({ insect }) => {
  if (!insect) return null;
  
  return (
    <motion.img
      src={BACKEND_URL + insect.image}
      alt={insect.name}
      className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-12 sm:h-12 md:w-14 md:h-14"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      draggable={false}
      style={{ userSelect: "none" }} // Inline CSS to disable selection
    />
  );
};

export default InsectDisplay;