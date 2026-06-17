import {useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";

function HamburgerLine({ className } : { className ?: string }) {
    return <span className={`block w-6 h-[1px] md:h-[2px] bg-cream/70 transition-all duration-300 ${className ?? ''}`}/>
}

export default function LandingNavbar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const logoHref = router.pathname === '/' ? '#' : '/';
    const navLinks = [
        {name: 'Mentors', href: '/mentors'},
        {name: 'Staff', href: '/staff'},
        {name: 'Services', href: '/#services'},
        {name: 'About Us', href: '/about-us'},
        {name: 'Contact Us', href: '/contact-us'},
    ];
    const isLoggedIn = false;

    return (
        <>
            <nav className="flex fixed top-0 left-0 right-0 z-50 items-center h-[60px] md:h-[83px] px-7 bg-up-maroon-dark">
                {/* Logo and title */}
                <div className="xl:w-1/4 min-w-fit">
                    <Link href={logoHref} className="inline-flex items-center gap-2">
                        <div className="flex items-center gap-[1px]">
                            <Image src="https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/logos/uplogo.png"
                                   alt="UP Logo" width={60} height={60} priority
                                   className="w-[40px] md:w-[60px] h-[40px] md:h-[60px] object-contain"/>
                            <Image src="https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/logos/LRC_logo_white.png"
                                   alt="UPB LRC Logo" width={60} height={60} priority
                                   className="w-[50px] md:w-[75px] h-[50px] md:h-[75px] object-contain"/>
                        </div>

                        <div className="leading-tight">
                            <span className="block text-[13px] md:text-[20px] font-body font-medium text-cream/70 tracking-widest uppercase">UPB LRC</span>
                            <span className="block text-[8px] md:text-[15px] font-semibold text-up-yellow-light tracking-wider">PeerConnect</span>
                        </div>
                    </Link>
                </div>

                {/* Nav links */}
                <ul className="hidden lg:flex flex-1 gap-6 xl:gap-14 2xl:gap-20 list-none justify-center min-w-0">
                    {navLinks.map((link) => {
                        const isActive = router.pathname === link.href

                        return (
                            <li key={link.name}>
                                <Link href={link.href}
                                      className={`whitespace-nowrap lg:text-sm xl:text-base font-medium tracking-widest uppercase transition-colors duration-200 no-underline 
                                      ${isActive ? 'text-up-yellow-light font-bold' : 'text-cream/75 hover:text-up-yellow-light'}`}>
                                    {link.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                {/* User action */}
                <div className="hidden lg:flex items-center justify-end gap-3.5 min-w-fit xl:w-1/4">
                    <Link href={isLoggedIn ? "/dashboard" : "/login"}
                          className="bg-up-yellow text-up-maroon-dark px-7 py-2.5 text-[14px] font-semibold tracking-widest uppercase rounded-sm transition-colors duration-200 hover:bg-up-yellow-light no-underline">
                        {isLoggedIn ? "Dashboard" : "Log In"}
                    </Link>
                </div>

                {/* Hamburger button */}
                <div className="flex lg:hidden items-center justify-end flex-1">
                    <button onClick={() => setOpen(!open)} className="group flex flex-col justify-center items-center w-10 h-10 gap-[6px] focus:outline-none">
                        <HamburgerLine className={open ? "rotate-45 translate-y-[7px] md:translate-y-[8px]" : ""}/>
                        <HamburgerLine className={open ? "opacity-0" : ""}/>
                        <HamburgerLine className={open ? "-rotate-45 -translate-y-[7px] md:-translate-y-[8px]" : ""}/>
                    </button>
                </div>
            </nav>

            {/* Hamburger menu dropdown */}
            {open && (
                <div className="lg:hidden fixed top-[60px] md:top-[83px] left-0 right-0 z-40 bg-up-maroon-dark border-t border-cream/10">
                    <ul className="flex flex-col gap-2 px-6 md:px-7 py-2 md:py-4 list-none">
                        {navLinks.map((link) => {
                            const isActive = router.pathname === link.href

                            return (
                                <li key={link.name}>
                                    <Link href={link.href} onClick={() => setOpen(false)}
                                          className={`block text-[10px] md:text-[15px] py-0.5 md:py-3 font-medium tracking-widest uppercase transition-colors duration-200 no-underline border-b border-cream/10
                                            ${isActive ? 'text-up-yellow-light font-bold' : 'text-cream/75 hover:text-up-yellow-light'}`}>
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                        <li className="md:pt-4 pb-1 md:pb-2">
                            <Link href={isLoggedIn ? "/dashboard" : "/login"}
                                  className="bg-up-yellow text-up-maroon-dark px-3 md:px-7 py-1 md:py-2.5 text-[10px] md:text-[14px] font-semibold tracking-widest uppercase transition-colors duration-200 hover:bg-up-yellow-light no-underline">
                                {isLoggedIn ? "Dashboard" : "Log In"}
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};