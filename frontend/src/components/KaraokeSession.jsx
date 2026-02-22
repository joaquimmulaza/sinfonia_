import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import AudioPlayer from './AudioPlayer'
import ResultsView from './ResultsView'
import { parseTime } from '@/lib/utils'

export default function KaraokeSession({ data, audioFile }) {
    const [currentTime, setCurrentTime] = useState(0)
    const [audioSrc, setAudioSrc] = useState(null)


    // Create object URL for audio
    useEffect(() => {
        if (audioFile) {
            const url = URL.createObjectURL(audioFile)
            setAudioSrc(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [audioFile])

    // Strict timestamp-based line activation:
    // Use the first word's start_time exclusively (as provided by Gemini).
    // Only fall back to line.time when the line has no word-level data.
    // Never use Math.min or fixed offsets — they cause premature highlighting.
    const activeLineIndex = useMemo(() => {
        if (!data?.lyrics) return -1
        for (let i = data.lyrics.length - 1; i >= 0; i--) {
            const line = data.lyrics[i]
            const firstWord = line.words?.[0]
            // Strictly prefer first word's start_time; fall back to line.time only if absent
            const activationTime = firstWord
                ? parseTime(firstWord.start_time)
                : parseTime(line.time)
            if (currentTime >= activationTime) {
                // Uncomment below to debug sync in the console:
                // console.log(`[SYNC] line=${i} | audio=${currentTime.toFixed(3)}s | activates@=${activationTime.toFixed(3)}s | raw="${firstWord?.start_time ?? line.time}"`)
                return i
            }
        }
        return -1
    }, [currentTime, data])


    const handleTimeUpdate = useCallback((time) => {
        setCurrentTime(time)
    }, [])

    if (!audioSrc) return <div>Loading Audio...</div>

    return (
        <div className="relative flex flex-col h-full">
            {/* Main content area padding bottom to avoid player overlap */}
            <div className="flex-1 pb-24 overflow-hidden">
                <ResultsView data={data} activeLineIndex={activeLineIndex} currentTime={currentTime} />
            </div>

            <AudioPlayer src={audioSrc} onTimeUpdate={handleTimeUpdate} />
        </div>
    )
}
