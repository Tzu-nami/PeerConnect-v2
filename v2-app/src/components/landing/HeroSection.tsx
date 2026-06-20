import Link from "next/link"
import { FaChevronDown } from "react-icons/fa"

interface HeroSectionProps {
    shouldShowBookNow: boolean
    bookURL: string
}

export default function HeroSection({ shouldShowBookNow, bookURL }: HeroSectionProps) {
    const heroOverlay = {
        background: `linear-gradient(
            110deg,
            rgba(78,10,12,0.92) 0%,
            rgba(78,10,12,0.80) 40%,
            rgba(78,10,12,0.45) 70%,
            rgba(78,10,12,0.15) 100%)`
    }
    return (
        <section
            className="relative w-full min-h-[520px] sm:min-h-[600px] xl:h-[calc(100vh-83px)] flex flex-col justify-between overflow-hidden bg-cover bg-[center_30%]"
            style={{backgroundImage: "url('https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/hero/library.jpeg')"}}>
            {/* Background image overlay */}
            <div className="absolute inset-0 z-0" style={heroOverlay}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center flex-1
                            px-5 sm:px-10 md:px-12 lg:px-14 xl:px-20
                            pt-4 sm:pt-8 md:pt-10
                            pb-4 sm:pb-8 md:pb-10 animate-fade-up">

                <h2 className="text-[10px] sm:text-[13px] md:text-[14px] lg:text-[18px] xl:text-[22px]
                               font-heading tracking-[0.12rem] sm:tracking-[0.15rem] uppercase text-up-yellow
                               mb-2 md:mb-4 lg:mb-6 leading-snug">
                    University of the Philippines Baguio
                </h2>

                <h1 className="font-heading font-bold text-cream tracking-wide
                               text-[1.75rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl
                               leading-[1.05] mb-3 sm:mb-4 md:mb-6">
                    Learning <span className="hidden sm:inline"><br/></span> Resource <br/> Center
                </h1>

                <p className="font-light leading-relaxed sm:leading-loose text-cream/70
                              text-[11px] sm:text-sm md:text-sm lg:text-base xl:text-lg
                              max-w-[95%] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px]
                              mb-4 sm:mb-6 md:mb-8">
                    The UPB Learning Resource Center connects you with dedicated peer mentors ready to support your
                    academic journey.
                    Whether you&apos;re keeping up, catching up, or getting ahead, our mentors are here to guide you
                    every step of the way.
                </p>

                {shouldShowBookNow && (
                    <div>
                        <Link href={bookURL} className="inline-block bg-transparent border border-up-yellow text-up-yellow-light px-5 sm:px-8 md:px-10 py-2 sm:py-3 text-[10px] sm:text-xs md:text-[13px]
                              font-medium tracking-[0.12em] uppercase no-underline transition-colors duration-200
                              hover:bg-up-yellow hover:text-up-maroon-dark active:bg-up-yellow active:text-up-maroon-dark">
                            Book Now
                        </Link>
                    </div>
                )}
            </div>

            <Link href="#services"
                  className="hidden md:flex flex-col gap-1 items-center text-center justify-center z-20 pb-4 cursor-pointer text-up-yellow self-center animate-fade-up">
                <p className="tracking-[0.2rem] text-xs md:text-sm xl:text-lg font-bold opacity-90 mb-1">SCROLL</p>
                <div className="animate-bounce">
                    <FaChevronDown className="leading-none text-base md:text-lg xl:text-2xl"/>
                </div>
            </Link>
        </section>
    )
}