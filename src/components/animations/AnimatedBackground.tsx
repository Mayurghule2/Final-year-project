import { motion } from "framer-motion";
import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none ">
      {/* Animated circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-sky-700/10 blur-3xl"
        animate={{
          x: [0, 30, -10, 0],
          y: [0, -30, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 left-1/3 w-96 h-96 rounded-full bg-sky-700/10 blur-3xl"
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-violet-400/10 blur-3xl"
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -15, 25, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "easeInOut",
        }}
      />

      {/* Small floating particles */}
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-8 h-8 rounded-full bg-white/20 blur-sm"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight 
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth * 0.8,
              Math.random() * window.innerWidth * 0.8,
              Math.random() * window.innerWidth * 0.8
            ],
            y: [
              Math.random() * window.innerHeight * 0.8,
              Math.random() * window.innerHeight * 0.8,
              Math.random() * window.innerHeight * 0.8
            ],
          }}
          transition={{
            duration: 15 + index * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Light gradient overlay */}
    </div>
  );
};

export default AnimatedBackground;