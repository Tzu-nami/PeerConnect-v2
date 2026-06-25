export function sortData<T>(
    data: T[],
    sortCol: keyof T,
    sortDir: 'asc' | 'desc'
): T[] {
    return [...data].sort((a, b) => {
        const valA = String(a[sortCol] ?? '')
        const valB = String(b[sortCol] ?? '')
        return sortDir === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA)
    })
}