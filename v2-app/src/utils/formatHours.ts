export function formatHours(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0 mins';
  
  const hrs = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);

  if (hrs === 0) return `${mins} min${mins !== 1 ? 's' : ''}`;
  if (mins === 0) return `${hrs} hour${hrs !== 1 ? 's' : ''}`;
  
  return `${hrs} hour${hrs !== 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
}

export function format12hrTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}