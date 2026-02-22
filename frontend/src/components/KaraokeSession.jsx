import React, { useState, useEffect, useMemo, useRef } from 'react'
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

    // Optimization: Calculate active index efficiently
    // We want the line where the first word has started, or fallback to line timing
    const activeLineIndex = useMemo(() => {
        if (!data?.lyrics) return -1
        for (let i = data.lyrics.length - 1; i >= 0; i--) {
            const line = data.lyrics[i]
            const firstWord = line.words?.[0]
            if (firstWord && currentTime >= parseTime(firstWord.start_time)) {
                return i
            }
            // fallback para linhas sem words
            if (!firstWord && currentTime >= parseTime(line.time)) {
                return i
            }
        }
        return -1
    }, [currentTime, data])


    const handleTimeUpdate = (time) => {
        // Batch updates if needed, but modern React handles this well
        setCurrentTime(time)
    }

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
