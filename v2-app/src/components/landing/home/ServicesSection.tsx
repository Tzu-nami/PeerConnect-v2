import Link from "next/link";
import Image from "next/image";

// Icons
import { FaLongArrowAltRight } from "react-icons/fa";

export default function ServicesSection() {
    const services = [
        {
            title: "One-on-One Sessions",
            description: "Get personalized support from one of our experienced mentors. Work through challenging concepts, review course materials, and build confidence at your own pace.",
            href: "/services#one-on-one",
            img: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/services/one-on-one.jpeg",
            alt: "One on One Sessions",
            border: "border-b sm:border-b-0 sm:border-r border-cream-dark",
        },
        {
            title: "Group Sessions",
            description: "Gather with a group of friends in a guided session led by a peer mentor. Ideal for tackling challenging subjects together and learning from one another.",
            href: "/services#group-session",
            img: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/services/group-session.jpg",
            alt: "Group Sessions",
            border: "border-b sm:border-b-0 sm:border-r border-cream-dark",
        },
        {
            title: "Review Classes",
            description: "Prepare for major exams through review sessions led by experienced peer mentors. Review key topics and build effective exam strategies.",
            href: "/services#review-classes",
            img: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/services/review_classes.jpg",
            alt: "Review Classes",
            border: "border-b sm:border-b-0 border-cream-dark",
        },

    ]

    return(
        <section id="services" className="w-full px-4 sm:px-10 md:px-12 lg:px-20 xl:px-32 py-10 sm:py-16 md:py-20 scroll-mt-20">
            <div className="flex flex-col gap-1 sm:gap-2 md:gap-4 mb-4 sm:mb-6 md:mb-8">
                {/* Section title */}
                <div className="flex items-center gap-3 pb-4 sm:pb-5">
                    <h1 className="font-heading text-up-maroon text-2xl sm:text-4xl md:text-5xl font-semibold tracking-wider">What We Offer</h1>
                    <span className="block w-8 h-px bg-up-green"></span>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {services.map((service) => {
                    return(
                        <Link key={service.title} href={service.href} className={`group flex flex-col px-4 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-10 transition-colors hover:bg-cream-dark/30 ${service.border}`}>
                            <div className="relative w-full h-32 sm:h-44 md:h-48 mb-3 sm:mb-5">
                                <Image src={service.img} alt={service.alt} fill className="object-cover rounded-sm border border-cream-border" />
                            </div>
                            <div className="text-sm sm:text-base md:text-[15px] lg:text-[18px] xl:text-[22px] text-up-maroon font-medium mb-1 md:mb-2">{service.title}</div>
                            <div className="text-[11px] sm:text-sm lg:text-base leading-5 sm:leading-7 font-light text-gray-600 mb-2 md:mb-3">{service.description}</div>
                            <div className="flex items-center gap-1 text-up-maroon text-[11px] sm:text-sm font-light tracking-wide mt-auto">
                                Read more
                                <FaLongArrowAltRight className="hidden lg:flex opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"/>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}