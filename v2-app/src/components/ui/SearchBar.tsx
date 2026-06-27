import { FaSearch } from "react-icons/fa";

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
        <div className={`relative rounded-lg ${className}`}>
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                className="pl-8 pr-3 py-1.5 text-xs font-medium text-text-brown placeholder-gray-500 border border-cream-border rounded-lg bg-cream-complement outline-none focus:ring-1 focus:border-text-brown-light focus:ring-text-brown-light/30 w-full h-[36px] transition-shadow"
            />
        </div>
    );
}