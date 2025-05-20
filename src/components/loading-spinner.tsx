"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8 h-[70vh]"
      role="status"
    >
      <div className="relative">
        {/* Gradient background pulse */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 blur-xl opacity-70" />

        {/* Main spinner circles */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute h-20 w-20 rounded-full border-2 border-transparent border-t-pink-500/20 border-r-purple-500/20 animate-spin" />

          {/* Center icon */}
          <div className="relative h-8 w-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 shadow-lg">
            <div className="absolute inset-1 rounded-full bg-white" />
          </div>
        </motion.div>
      </div>

      {/* Loading text with dots animation */}
      <motion.div
        className="text-center font-medium text-gray-600 mt-[45px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.div>
      </motion.div>

      {/* Hidden text for screen readers */}
      <span className="sr-only">{text}</span>
    </div>
  );
}
