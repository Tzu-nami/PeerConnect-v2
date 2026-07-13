import {useRouter} from "next/router";
import Link from "next/link";

// Icons
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaGraduationCap } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { IoMailOutline } from "react-icons/io5";
import { BsFillTelephoneFill } from "react-icons/bs";
import { LuClock4 } from "react-icons/lu";

export default function LandingFooter({ userRole }: { userRole: string | null }) {
    const router = useRouter();
    const logoHref = router.pathname === '/' ? '#' : '/';
    const isLoggedIn = !!userRole
    const shouldShowBookNow = userRole !== 'admin'

    const footerLinks = [
        {name: 'Home', href: '/'},
        {name: 'Mentors', href: '/mentors'},
        {name: 'Staff', href: '/staff'},
        {name: 'Services', href: '/services'},
        {name: 'About Us', href: '/about-us'},
    ];

    return (
        <div className="text-white/60 bg-up-maroon-dark px-4 sm:px-12 lg:px-20 py-8 mt-auto">
            <div className="flex flex-col lg:flex-row justify-between mb-7 gap-8">
                {/* Left side */}
                <div className="flex flex-col gap-3 max-w-sm">
                    <Link href={logoHref}
                          className="flex items-center font-heading font-bold text-lg sm:text-xl text-white tracking-widest">
                        <FaGraduationCap className="mr-3 w-5 h-5 sm:w-7 sm:h-7"/>
                        Peer<span className="text-up-yellow">Connect</span>
                    </Link>
                    <div className="text-xs sm:text-sm leading-relaxed">
                        Connecting UPB students with peer mentors for enrichment sessions and academic success.
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="https://www.facebook.com/lrc.upbaguio" target="_blank" rel="noopener noreferrer"
                              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-colors">
                            <FaFacebook size={16}/>
                        </Link>
                        <Link href="https://x.com/lrc_upbaguio" target="_blank" rel="noopener noreferrer"
                              className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 hover:bg-white/10 hover:text-white transition-colors">
                            <FaXTwitter size={16}/>
                        </Link>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex flex-wrap gap-8 text-xs sm:text-sm">
                    {/* Navigate */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="font-bold text-up-yellow tracking-widest uppercase mb-1">Navigate</div>
                        <ul className="flex flex-col gap-2 sm:gap-3">
                            {footerLinks.map((link) => {
                                const isActive = router.pathname === link.href
                                return (
                                    <li key={link.name}>
                                        <Link href={link.href}
                                              className={`hover:text-white transition-colors ${isActive ? 'text-up-yellow-light' : ''}`}>
                                            {link.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="font-bold text-up-yellow tracking-widest uppercase mb-1">Quick Actions</div>
                        {isLoggedIn ? (
                            <>
                                {shouldShowBookNow && (
                                    <>
                                        <Link href={`/${userRole}/bookings`} className="hover:text-white transition-colors">
                                            Book a Session
                                        </Link>
                                        <Link href={`/${userRole}/history`} className="hover:text-white transition-colors">
                                            View bookings
                                        </Link>
                                    </>
                                )}
                                <Link href={`/${userRole}/dashboard`} className="hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <Link href="/login" className="hover:text-white transition-colors">
                                Log In
                            </Link>
                        )}
                    </div>

                    {/* Contact us */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <div className='font-bold text-up-yellow tracking-widest uppercase mb-1'>Contact Us</div>
                        <div className="flex items-center gap-2">
                            <FaLocationDot/>
                            <span>2nd Floor, University Library, UPB</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <LuClock4 />
                            <span>Mon–Fri, 8:00 AM – 5:00 PM</span>
                        </div>
                        <div>
                            <Link href="https://mail.google.com/mail/?view=cm&fs=1&to=lrc.upbaguio@up.edu.ph"
                                  target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-2 hover:text-white transition-colors">
                                <IoMailOutline />
                                lrc.upbaguio@up.edu.ph
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <BsFillTelephoneFill />
                            <span>(074) 444 8720</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row justify-between border-t border-white/20 text-xs pt-5 gap-2">
                <div>&copy; {new Date().getFullYear()} LRC PeerConnect · University of the Philippines Baguio. All rights reserved.
                </div>
            </div>
        </div>
    );
};