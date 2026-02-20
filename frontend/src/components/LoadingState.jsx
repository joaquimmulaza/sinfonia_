import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const loadingMessages = [
    "A fazer upload da faixa...",
    "A isolar os vocais e instrumentos...",
    "A traduzir as letras e gírias...",
    "A analisar a vibe e o significado..."
];

export default function LoadingState() {
    const [messageIndex, setMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        }, 2500) // Change message every 2.5 seconds
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-12">
            <div className="relative flex items-center justify-center h-32 w-full max-w-md mt-8">
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

            <div className="w-full max-w-lg relative flex items-center justify-center min-h-[100px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={messageIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-center space-y-2 w-full px-6"
                    >
                        <h3 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary/80 to-primary leading-tight">
                            {loadingMessages[messageIndex]}
                        </h3>
                        <p className="text-muted-foreground text-sm md:text-base animate-pulse">Sinfonia AI is processing...</p>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
