import type { WeekSchedule } from "@/types/mentor";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

interface Props {
    schedule: WeekSchedule;
}

export default function MentorAvailGrid({ schedule }: Props) {
    return (
        <div>
            <div className="avail-grid">
                {DAYS.map((day) => (
                    <div key={day}>
                        <div className="avail-day-header">
                            {day.charAt(0).toUpperCase() + day.slice(1,3)}
                        </div>

                        {/* Slots */}
                        <div className="avail-day-col">
                            {schedule[day] ? (
                                schedule[day]!.slots.map((slot, i) => (
                                    <div key={i}
                                        className="avail-slot">
                                            {slot.start}<br />{slot.end}
                                    </div>
                                ))
                            ) : (
                                <div className="avail-empty"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-[12px] mt-3 flex items-center justify-center gap-4">
                <span>
                    <span className="inline-block w-3 h-3 rounded bg-day-available mr-1 align-middle"></span>
                    Available
                </span>
                <span>
                    <span className="inline-block w-3 h-3 rounded border border-dashed border-gray-200 bg-day-unavailable mr-1 align-middle"></span>
                    Unavailable
                </span>
            </p>
        </div>
    );
}