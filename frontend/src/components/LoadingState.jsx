import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-12">
            <div className="relative flex items-center justify-center h-32 w-full max-w-md">
                {/* Pulsating waves */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border-2 border-primary/30"
                        style={{
                            width: 50 + i * 40,
                            height: 50 + i * 40,
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.8, 0.3],
                            borderWidth: ["2px", "4px", "2px"]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
                <motion.div
                    className="z-10 bg-primary rounded-full p-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                >
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-background rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 md:w-6 md:h-6 bg-primary rounded-full animate-pulse" />
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center space-y-2"
            >
                <h3 className="text-2xl font-bold">Analysing Audio Frequency...</h3>
                <p className="text-muted-foreground animate-pulse">Extracting lyrics and emotions</p>
            </motion.div>
        </div>
    )
}
