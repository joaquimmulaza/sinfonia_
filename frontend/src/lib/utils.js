import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function parseTime(timeStr) {
    if (timeStr === null || timeStr === undefined) return 0
    const str = String(timeStr).trim()
    // Se não tem ':', é segundos puros (número ou string)
    if (!str.includes(':')) return parseFloat(str) || 0
    const parts = str.split(':').map(Number)
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0
}
