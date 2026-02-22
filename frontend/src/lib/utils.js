import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function parseTime(timeStr) {
    if (timeStr === null || timeStr === undefined) return 0
    const str = String(timeStr).trim()
    if (str === '') return 0

    // No colon → pure seconds (integer or decimal), e.g. "83.4" or 83
    if (!str.includes(':')) {
        const n = parseFloat(str)
        return isNaN(n) ? 0 : n
    }

    // "M:SS" or "M:SS.d" format (Gemini uses this: e.g. "0:59.0", "1:23.4")
    const parts = str.split(':')
    if (parts.length === 2) {
        const mins = parseFloat(parts[0])
        const secs = parseFloat(parts[1]) // handles "59.0", "23.45" correctly
        return (isNaN(mins) ? 0 : mins) * 60 + (isNaN(secs) ? 0 : secs)
    }

    // "H:MM:SS" format
    if (parts.length === 3) {
        const hrs = parseFloat(parts[0])
        const mins = parseFloat(parts[1])
        const secs = parseFloat(parts[2])
        return (isNaN(hrs) ? 0 : hrs) * 3600 +
            (isNaN(mins) ? 0 : mins) * 60 +
            (isNaN(secs) ? 0 : secs)
    }

    return 0
}
