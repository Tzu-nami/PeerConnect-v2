// Time formatting
export const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
export const TODAY_FORMATTED = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' })

export function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Manila'
    })
}