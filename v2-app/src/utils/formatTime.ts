// Time formatting
export const TODAY = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })

export function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Manila'
    })
}