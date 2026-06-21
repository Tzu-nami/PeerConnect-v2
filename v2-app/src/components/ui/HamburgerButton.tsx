interface HamburgerButtonProps {
    open: boolean
    onClick: () => void
}

function HamburgerLine({ className }: { className?: string }) {
    return (
        <span className={`block w-6 h-[1px] md:h-[2px] bg-cream/70 transition-all duration-300 ${className ?? ''}`} />
    )
}

export default function HamburgerButton({ open, onClick }: HamburgerButtonProps) {
    return (
        <button onClick={onClick}
                className="group flex flex-col justify-center items-center w-10 h-10 gap-[6px] focus:outline-none cursor-pointer">
            <HamburgerLine className={open ? "rotate-45 translate-y-[7px] md:translate-y-[8px]" : ""} />
            <HamburgerLine className={open ? "opacity-0" : ""} />
            <HamburgerLine className={open ? "-rotate-45 -translate-y-[7px] md:-translate-y-[8px]" : ""} />
        </button>
    )
}