import React, { useState, useEffect, useMemo, useRef } from 'react'
import AudioPlayer from './AudioPlayer'
import ResultsView from './ResultsView'

export default function KaraokeSession({ data, audioFile }) {
    const [currentTime, setCurrentTime] = useState(0)
    const [audioSrc, setAudioSrc] = useState(null)

    // Memoize timings parsing
    // Robust time parser: handles MM:SS, H:MM:SS, etc.
    const parseTime = (timeStr) => {
        if (!timeStr) return 0
        const parts = timeStr.trim().split(':').map(Number)
        // Reverse parts to handle [SS, MM, HH] logic easily
        // 0:45 -> [0, 45] -> 0*60 + 45
        // 1:20:30 -> [1, 20, 30] -> 1*3600 + 20*60 + 30

        let seconds = 0
        if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1]
        } else if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
        }
        return seconds
    }

    // Create object URL for audio
    useEffect(() => {
        if (audioFile) {
            const url = URL.createObjectURL(audioFile)
            setAudioSrc(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [audioFile])

    const lineTimings = useMemo(() => {
        if (!data || !data.lyrics) return []
        return data.lyrics.map(line => parseTime(line.time))
    }, [data])


    // Optimization: Calculate active index efficiently
    // We want the last index where timing <= currentTime
    const activeLineIndex = useMemo(() => {
        let index = -1
        for (let i = 0; i < lineTimings.length; i++) {
            if (currentTime >= lineTimings[i]) {
                index = i
            } else {
                break
            }
        }
        return index
    }, [currentTime, lineTimings])


    const handleTimeUpdate = (time) => {
        // Batch updates if needed, but modern React handles this well
        setCurrentTime(time)
    }

    if (!audioSrc) return <div>Loading Audio...</div>

    return (
        <div className="relative flex flex-col h-full">
            {/* Main content area padding bottom to avoid player overlap */}
            <div className="flex-1 pb-24 overflow-hidden">
                <ResultsView data={data} activeLineIndex={activeLineIndex} />
            </div>

            <AudioPlayer src={audioSrc} onTimeUpdate={handleTimeUpdate} />
        </div>
    )
}
