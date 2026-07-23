import { useState, useEffect } from 'react';
import CrudModal from '@/components/ui/CrudModal';
import { FaMapLocationDot } from 'react-icons/fa6';
import type { AdminSession } from '@/types/admin';

const AVAILABLE_ROOMS = [
    "LRC Tutorial Room 1",
    "LRC Tutorial Room 2",
    "Library",
];

interface AssignRoomModalProps {
    isOpen: boolean;
    session: AdminSession | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AssignRoomModal({ isOpen, session, onClose, onSuccess }: AssignRoomModalProps) {
    const [selectedRoom, setSelectedRoom] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        if (isOpen && session) {
            setSelectedRoom(initialRoom);
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, session]);

    const handleSave = async () => {
        if (!session || !selectedRoom) return;
        setError('');
        setIsSubmitting(true);
        try {
            const idsToUpdate = session.group_ids?.length > 0 ? session.group_ids : [session.id];
            const res = await fetch('/api/admin/sessions/assign-room', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ids: idsToUpdate, 
                    room: selectedRoom 
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to assign room.');
            }
            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session) return null;
    const initialRoom = session.room && session.room !== "TBA" ? session.room : "";
    const hasChanges = selectedRoom !== initialRoom;

    return (
        <CrudModal
            open={isOpen}
            onClose={onClose}
            maxWidth="max-w-md"
            title="Assign Room"
            subtitle="Select a room for this session."
            footer={
                <div className="flex gap-3">
                    <button 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-white-border rounded-lg hover:bg-white-dark transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSubmitting || !selectedRoom || !hasChanges}
                        className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-btn-gray hover:bg-btn-gray-hover rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
                    >
                        {isSubmitting ? <>Saving... </> : 'Save Room'}
                    </button>
                </div>
            }
        >
            <div className="grid grid-cols-2 gap-y-4 gap-x-3 bg-white-complement p-4 rounded-xl border border-white-border mb-4">
                <div>
                    <p className="text-[10px] font-bold text-text-white-light uppercase mb-0.5">Student</p>
                    <p className="text-xs font-bold text-slate-700 truncate" title={session.studentNames || session.student}>{session.student}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-text-white-light uppercase mb-0.5">Mentor</p>
                    <p className="text-xs font-bold text-slate-700 truncate" title={session.mentor}>{session.mentor}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-text-white-light uppercase mb-0.5">Subject</p>
                    <p className="text-xs font-bold text-slate-700 truncate" title={`${session.subject} - ${session.subjectName}`}>{session.subject}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-text-white-light uppercase mb-0.5">Topic</p>
                    <p className="text-xs font-bold text-slate-700 truncate" title={`${session.topic}`}>{session.topic}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-text-white-light uppercase mb-0.5">Date</p>
                    <p className="text-xs font-bold text-slate-700">{session.date}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-text-white-light uppercase mb-0.5">Time</p>
                    <p className="text-xs font-bold text-slate-700">{session.time}</p>
                </div>
            </div>

            <div>
                <label className="text-[10px] font-bold text-up-maroon uppercase tracking-wider block mb-1.5">Select Room</label>
                <div className="relative flex items-center">
                <FaMapLocationDot className="absolute left-3 text-up-maroon/50 text-sm pointer-events-none" />
                    <select 
                        value={selectedRoom}    
                        onChange={(e) => setSelectedRoom(e.target.value)} 
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-white-border bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-up-maroon/30 focus:border-up-maroon transition shadow-sm appearance-none cursor-pointer"
                    >
                        <option value="" disabled hidden>--- Select Room ---</option>
                        {AVAILABLE_ROOMS.map(room => (
                        <option key={room} value={room}>{room}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500 font-bold mt-4 bg-red-50 p-2 rounded-lg border border-red-100 text-center">{error}</p>
            )}
        </CrudModal>
    );
}