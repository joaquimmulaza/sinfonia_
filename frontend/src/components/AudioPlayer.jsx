import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AudioPlayer({ src, onTimeUpdate }) {
    const audioRef = useRef(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        let rafId
        const tick = () => {
            onTimeUpdate(audio.currentTime)
            rafId = requestAnimationFrame(tick)
        }
        const startTick = () => { rafId = requestAnimationFrame(tick) }
        const stopTick = () => cancelAnimationFrame(rafId)

        audio.addEventListener('play', startTick)
        audio.addEventListener('pause', stopTick)
        audio.addEventListener('ended', stopTick)
        // se já estiver a tocar:
        if (!audio.paused) startTick()

        return () => {
            stopTick()
            audio.removeEventListener('play', startTick)
            audio.removeEventListener('pause', stopTick)
            audio.removeEventListener('ended', stopTick)
        }
    }, [onTimeUpdate])

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
        >
            <div className="container max-w-screen-2xl mx-auto flex items-center justify-center">
                <audio
                    ref={audioRef}
                    controls
                    className="w-full max-w-2xl h-10 accent-primary"
                    src={src}
                    autoPlay
                />
            </div>
        </motion.div>
    )
}
