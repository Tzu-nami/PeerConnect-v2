import type { MentorAvailability, MentorBookedSlot } from '@/types/bookings';
import { format12hrTime } from '@/utils/formatHours';
import { MdCalendarMonth, MdEvent } from 'react-icons/md';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday'] as const;

interface Segment { type: 'free' | 'booked'; start: string; end: string; }

function splitSegments( slotStart: string, slotEnd: string, bookedSlots: { start: string; end: string }[]
): Segment[] {
  if (bookedSlots.length === 0) return [{ type: 'free', start: slotStart, end: slotEnd }];

  // Check booked hours
  const clipped = bookedSlots
    .map((b) => ({
      type: 'booked' as const,
      start: b.start < slotStart ? slotStart : b.start,
      end:   b.end   > slotEnd   ? slotEnd   : b.end,
    }))
    .sort((a, b) => a.start.localeCompare(b.start));

  // Slice availability based on booked hours
  const segments: Segment[] = [];
  let cursor = slotStart;
  for (const b of clipped) {
    if (cursor < b.start) segments.push({ type: 'free', start: cursor, end: b.start });
    segments.push(b);
    cursor = b.end;
  }
  if (cursor < slotEnd) segments.push({ type: 'free', start: cursor, end: slotEnd });
  return segments;
}

interface ColDay {
  key: typeof DAYS[number];
  label: string;
  dateStr: string;
  dayNum: string;
  isChosen: boolean;
}

function buildWeekDates(selectedDate: string | null): ColDay[] {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  const baseDate = selectedDate || todayStr;
  const chosen = new Date(baseDate + 'T00:00:00');
  
  const dow = chosen.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(chosen);
  monday.setDate(chosen.getDate() + mondayOffset);

  return DAYS.map((d, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    const dateStr = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
    
    return {
      key: d,
      label: d.charAt(0).toUpperCase() + d.slice(1, 3),
      dateStr,
      dayNum: String(dt.getDate()),
      isChosen: selectedDate ? dateStr === selectedDate : false,
    };
  });
}

interface MentorAvailabilityWidgetProps {
  mentorProfileId: string;
  availabilities: MentorAvailability[];
  bookedSlots: MentorBookedSlot[];
  selectedDate: string | null;
}

export default function MentorAvailabilityWidget({
  mentorProfileId, availabilities, bookedSlots, selectedDate,
}: MentorAvailabilityWidgetProps) {

  // Build schedule
  const mentorAvails = availabilities.filter((a) => a.mentorProfile_id === mentorProfileId);
  const schedule: Record<string, { startRaw: string; endRaw: string }[]> = {};
  for (const a of mentorAvails) {
    const key = a.day_of_week.toLowerCase();
    if (!schedule[key]) schedule[key] = [];
    schedule[key].push({
      startRaw: a.start_time.substring(0, 5),
      endRaw:   a.end_time.substring(0, 5),
    });
  }

  // Display weekly schedule
  const weekDates = buildWeekDates(selectedDate);
  const weekBannerLabel = (() => {
    const d1 = new Date(weekDates[0].dateStr + 'T00:00:00');
    const d2 = new Date(weekDates[weekDates.length - 1].dateStr + 'T00:00:00');
    const fmt = (d: Date) => d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    return `${fmt(d1)} – ${fmt(d2)}`;
  })();

  return (
    <div className="mt-4 p-4 bg-white border border-cream-border rounded-lg animate-[slide-down_0.6s_ease-out]">
      <p className="text-[10px] font-bold text-text-brown uppercase tracking-widest mb-1 text-center">
        Mentor's Availability & Booked Slots
      </p>

      {/* Week schedule */}
      <div className="mb-3 text-center text-xs font-medium text-text-brown bg-cream-dark rounded py-1.5 flex items-center justify-center">
        <MdEvent className="mr-1.5 text-xl" />
        <span>Week of {weekBannerLabel}</span>
      </div>
      
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {weekDates.map((col) => {
          const daySlots = schedule[col.key] ?? [];
          const dayBooked = bookedSlots.filter((b) => b.mentor_id === mentorProfileId && b.date === col.dateStr);

          return (
            <div key={col.key}>
              <div className={`text-center text-[10px] font-bold py-1 border border-cream-border rounded-lg mb-1 ${col.isChosen ? 'text-green-700 bg-green-50 border-emerald-100' : 'text-text-brown-light'}`}>
                <span>{col.label}</span>
                <span className="block text-[9px] font-normal">{col.dayNum}</span>
              </div>

              {/* Slots */}
              <div className={`flex flex-col gap-1 rounded-lg min-h-[40px]`}>
                {daySlots.length === 0 ? (
                  <div className="border border-dashed border-gray-200 bg-gray-50 rounded-lg min-h-[28px]">
                  </div>
                ) : daySlots.map((slot, si) => {
                  const segmentsToShow = splitSegments(slot.startRaw, slot.endRaw, dayBooked.map((b) => ({ start: b.start, end: b.end })));

                  return segmentsToShow.map((segment, s) => (
                    <div
                      key={`${si}-${s}`}
                      title={`${segment.type === 'booked' ? 'Booked' : 'Available'}: ${format12hrTime(segment.start)} – ${format12hrTime(segment.end)}`}
                      className={`text-center rounded-lg text-[9px] font-medium px-0.5 py-0.5 leading-tight ${
                        segment.type === 'booked'
                          ? 'bg-red-50 border border-red-100 text-red-600'
                          : 'bg-emerald-100 border border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {format12hrTime(segment.start)}<br />{format12hrTime(segment.end)}
                    </div>
                  ));
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[9px] font-medium mt-3 flex items-center justify-center gap-4 text-gray-500 flex-wrap">
        <span><span className="inline-block w-2.5 h-2.5 rounded bg-emerald-100 mr-1 align-middle border border-emerald-200"></span>Available</span>
        <span><span className="inline-block w-2.5 h-2.5 rounded bg-red-50 mr-1 align-middle border border-red-100"></span>Already Booked</span>
        <span><span className="inline-block w-2.5 h-2.5 rounded border border-dashed border-gray-300 bg-gray-50 mr-1 align-middle"></span>Unavailable</span>
      </p>
    </div>
  );
}