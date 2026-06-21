interface SearchBarProps {
    value: string;
    onChange: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
    className = "w-56"
}: SearchBarProps) {
    return (
        <div className={`relative shadow-sm ${className}`}>
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs"></i>
            <input 
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-8 pr-3 py-1.5 text-xs font-medium text-slate-700 placeholder-gray-400 border border-gray-200 rounded-lg bg-white outline-none focus:ring-1 focus:border-up-maroon focus:ring-up-maroon w-full h-[34px] transition-shadow" 
            />
        </div>
    );
}