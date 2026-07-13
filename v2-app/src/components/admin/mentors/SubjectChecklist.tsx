interface Subject { id: string; code: string; name: string; }

interface Props {
    subjects: Subject[];
    selected: string[];
    onChange: (selected: string[]) => void;
    error?: string;
}

export default function SubjectChecklist({ subjects, selected, onChange, error }: Props) {
    const toggle = (id: string) => {
        onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
    };

    return (
        <div>
            <div className="border border-white-border bg-white-dark rounded-xl overflow-hidden">
                <div className="max-h-44 overflow-y-auto custom-scrollbar divide-y divide-white-dark bg-white">
                    {subjects.length === 0 ? (
                        <p className="text-xs text-text-primary text-center py-4">No subjects yet. Please add a subject first.</p>
                    ) : subjects.map((s) => (
                        <div key={s.id} className="flex items-center px-4 hover:bg-white-hover">
                            <input 
                                type="checkbox"
                                id={`subject-${s.id}`}
                                checked={selected.includes(s.id)}
                                onChange={() => toggle(s.id)}
                                className="rounded border-white-border text-btn-brown focus:ring-btn-brown w-4 h-4 cursor-pointer flex-shrink-0" 
                            />
                            <label htmlFor={`subject-${s.id}`} className="flex items-center gap-3 ml-3 py-2.5 cursor-pointer flex-1">
                                <span className="text-xs font-bold text-text-primary w-20">{s.code}</span>
                                <span className="text-xs text-text-white-light">{s.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}