import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// I'll stick to standard div with overflow for scroll area to avoid missing components, or implement a simple one.
// The prompt asked for "Button, Card, Skeleton, Select". It didn't ask for ScrollArea or Tabs explicitly, but "painel sincronizado... ou em aba".
// I'll implement a simple tab system or just use side-by-side.

export default function ResultsView({ data, activeLineIndex = -1 }) {
    const { lyrics, translation, meaning } = data

    // Refs for scrolling
    const originalRefs = useRef([])
    const translationRefs = useRef([])

    useEffect(() => {
        if (activeLineIndex >= 0) {
            // Scroll original lyrics
            const originalEl = originalRefs.current[activeLineIndex]
            if (originalEl) {
                originalEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }

            // Scroll translated lyrics
            const translationEl = translationRefs.current[activeLineIndex]
            if (translationEl) {
                translationEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }
    }, [activeLineIndex])

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6 h-full flex flex-col">
            {/* Meaning Card */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span>{meaning.emoji}</span>
                            <span>Meaning & Context</span>
                        </CardTitle>
                        <CardDescription>{meaning.sentiment}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-lg font-medium leading-relaxed">
                            "{meaning.summary}"
                        </p>
                        <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground italic">
                            {meaning.context}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {meaning.metaphors && meaning.metaphors.map((meta, idx) => (
                                <div key={idx} className="bg-background/80 p-3 rounded-md border border-border">
                                    <span className="block font-semibold text-primary mb-1">"{meta.text}"</span>
                                    <span className="text-xs text-muted-foreground">{meta.explanation}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Lyrics & Translation Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                {/* Original Lyrics */}
                <div className="flex flex-col space-y-2 h-[500px]"> {/* Fixed height for scroll */}
                    <h3 className="font-semibold text-lg flex items-center sticky top-0 bg-background/95 z-10 py-2">
                        Original Lyrics
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-4 space-y-4 rounded-md border p-4 shadow-inner bg-muted/10 custom-scrollbar scroll-smooth">
                        {lyrics.map((line, idx) => {
                            const isActive = idx === activeLineIndex;
                            return (
                                <motion.div
                                    key={idx}
                                    ref={el => originalRefs.current[idx] = el}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                        opacity: isActive ? 1 : 0.7,
                                        x: 0,
                                        scale: isActive ? 1.05 : 1,
                                        color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                                    }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-2 rounded transition-all duration-300 ${isActive ? 'bg-primary/10 font-medium' : 'hover:bg-primary/5'}`}
                                >
                                    <span className="text-xs text-muted-foreground block mb-1 font-mono">{line.time}</span>
                                    <p className="text-base leading-relaxed">{line.text}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Translation */}
                <div className="flex flex-col space-y-2 h-[500px]">
                    <h3 className="font-semibold text-lg flex items-center sticky top-0 bg-background/95 z-10 py-2">
                        Translation
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-4 space-y-4 rounded-md border p-4 shadow-inner bg-muted/10 custom-scrollbar scroll-smooth">
                        {translation.map((line, idx) => {
                            const isActive = idx === activeLineIndex;
                            return (
                                <motion.div
                                    key={idx}
                                    ref={el => translationRefs.current[idx] = el}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{
                                        opacity: isActive ? 1 : 0.7,
                                        x: 0,
                                        scale: isActive ? 1.05 : 1,
                                        color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
                                    }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`p-2 rounded transition-all duration-300 ${isActive ? 'bg-primary/10 font-medium' : 'hover:bg-primary/5'}`}
                                >
                                    <span className="text-xs text-muted-foreground block mb-1 font-mono">{line.time}</span>
                                    <p className="text-base leading-relaxed">{line.text}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
