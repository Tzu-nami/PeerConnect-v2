import Link from "next/link"
import { Fragment } from "react"

// Icons
import { FiLogIn } from "react-icons/fi"
import { MdOutlineSchedule } from "react-icons/md"
import { FaUsers } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa"


interface HowItWorksProps {
    dashboardURL: string
    bookURL: string
    historyURL: string
}

export default  function HowItWorks({ dashboardURL, bookURL, historyURL }: HowItWorksProps ) {
    const steps = [
        {
            step: "Step 1",
            title: "Login",
            icon: FiLogIn,
            description: "Sign in with your UP email to access the booking system, browse available mentors and check session schedules.",
            href: dashboardURL,
        },
        {
            step: "Step 2",
            title: "Schedule",
            icon: MdOutlineSchedule,
            description: "Choose a session type, select your preferred mentor and subject, and pick a date and time that works for you.",
            href: bookURL,
        },
        {
            step: "Step 3",
            title: "Attend",
            icon: FaUsers,
            description: "Attend your scheduled session and make the most of your time. Engage, ask questions, and learn actively.",
            href: historyURL,
        }
    ]

    return (
        <section className="w-full px-5 sm:px-10 md:px-16 lg:px-28 xl:px-52 py-8 sm:py-16 md:py-20 bg-up-green">
            <div className="flex flex-col gap-2 sm:gap-4 mb-6 sm:mb-12 text-center">
                {/* Section title */}
                <div className="flex items-center justify-center gap-3 text-up-yellow text-[9px] sm:text-[10px] md:text-xs tracking-widest font-medium uppercase">
                    <span className="block w-6 md:w-8 h-px bg-up-yellow"></span>
                    How It Works
                    <span className="block w-6 md:w-8 h-px bg-up-yellow"></span>
                </div>
                <h2 className="font-heading text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wider">
                    Three Simple Steps
                </h2>
            </div>

            {/* Steps */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 md:gap-6 text-white">
                {steps.map((step, index) => {
                    const Icon = step.icon
                    return(
                        <Fragment key={step.step}>
                            <Link href={step.href}
                                  className="group w-full sm:flex-1 sm:max-w-none mx-auto flex flex-col items-center px-5 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-12 border border-up-yellow/25 no-underline transition-all duration-300 hover:border-up-yellow hover:bg-white/5">
                                <div><Icon className="text-2xl sm:text-5xl text-up-yellow/70 mb-2 sm:mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-up-yellow" /></div>
                                <div className="text-[9px] sm:text-xs md:text-sm text-up-yellow tracking-[0.15em] sm:tracking-[0.2em] font-semibold uppercase mb-1 sm:mb-2">{step.step}</div>
                                <div className="font-heading text-base sm:text-xl md:text-2xl text-white font-medium tracking-wider mb-2 sm:mb-4">{step.title}</div>
                                <span className="block w-8 h-px bg-up-yellow/40 mb-2 sm:mb-4 transition-all duration-300 group-hover:w-12 group-hover:bg-up-yellow/60"></span>
                                <div className="text-[11px] sm:text-sm md:text-base leading-5 sm:leading-7 font-light text-white/60 text-center">{step.description}</div>
                            </Link>

                            {index < steps.length - 1 && <FaArrowRight className="text-up-yellow/40 text-xl sm:text-3xl flex-shrink-0 rotate-90 sm:rotate-0 self-center my-0" />}
                        </Fragment>
                    )
                })}
            </div>
        </section>
    )
}