export function getRatingLabel(avg: number | null): string {
    if (avg === null) return "N/A"
    if (avg >= 4.5) return "Excellent"
    if (avg >= 3.5) return "Good"
    if (avg >= 2.5) return "Average"
    return "Poor"
}