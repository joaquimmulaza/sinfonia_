import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function parseTime(timeStr) {
    if (!timeStr) return 0
    const parts = String(timeStr).trim().split(':').map(Number)
    let seconds = 0
    if (parts.length === 2) {
        seconds = parts[0] * 60 + parts[1]
    } else if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2]
    } else if (parts.length === 1) {
        seconds = parts[0] // fallback if it's just seconds
    }
    return seconds
}
