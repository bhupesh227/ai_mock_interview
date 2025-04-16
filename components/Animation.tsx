"use client";
import React from 'react'
import { motion } from 'framer-motion'

interface AnimationProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    distance?: number;
}



const Animation = ({
    children,
    className = "",
    delay = 0.1,
    duration = 0.5,
    distance = 50
}: AnimationProps) => {
  return (
    <motion.div
        className={className}
        initial={{ opacity: 0, y: distance }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration :duration, delay:delay ,ease: "easeIn" }}
    >
        {children}
    </motion.div>
  )
}

export default Animation;


