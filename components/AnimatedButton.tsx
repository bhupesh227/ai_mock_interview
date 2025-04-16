"use client";
import React ,{ useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link';
import { ArrowRight } from "lucide-react";


interface AnimatedButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const AnimatedButton =({
    href,
    children,
    className = "",
    delay = 0.1,
}:AnimatedButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showGlow, setShowGlow] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        const timer = setTimeout(() => {
            setShowGlow(true);
        }, 1000); 

        return () => clearTimeout(timer);
    }, [isMounted]);
    if (!isMounted) return null; 

    return(
        <div className='relative inline-block mx-auto mt-2'>
            {showGlow && (
                <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 opacity-70 blur-lg"
                style={{ 
                  paddingInline: '15px',
                  paddingBlock: '10px',
                  marginInline: '-15px',
                  marginBlock: '-10px',
                  background: 'linear-gradient(90deg,rgba(38, 122, 153, 1) 8%, rgba(27, 250, 120, 1) 51%, rgba(21, 122, 194, 1) 100%)',
                }}
                initial={{ opacity: 0}}
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  scale: [0.8, 1.08, 0.8]
                }}
                transition={{ 
                  duration: 3.5, 
                  ease: "easeIn",
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                
              />
            )}
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                duration: 1,
                ease: "easeIn",
                delay: 1 + delay,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Link href={href}>
                    <motion.button 
                        className={`relative px-5 py-2.5 bg-white dark:bg-orange-300 text-black dark:text-black rounded-full font-medium text-lg flex items-center gap-2 cursor-pointer ${className}`}
                    >
                        <span>{children}</span>
                        
                        <motion.div
                        animate={{ 
                            x: isHovered ? 8 : 0
                        }}
                        transition={{ 
                            duration: 0.2,
                            ease: "easeOut"
                        }}
                        >
                            <ArrowRight size={18} />
                        </motion.div>
                        
                        
                        {isHovered && (
                        <motion.div 
                            className="absolute inset-0 overflow-hidden rounded-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div 
                            className="w-20 h-full bg-white/40 blur-md absolute -skew-x-12"
                            initial={{ left: "-20%" }}
                            animate={{ left: "120%" }}
                            transition={{ duration: 1, ease: "easeIn" ,repeat: Infinity, repeatType: "reverse" }}
                            />
                        </motion.div>
                        )}
                    </motion.button>
                </Link>
            </motion.div>
        </div>
    )
}

export default AnimatedButton