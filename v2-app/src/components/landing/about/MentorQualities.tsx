import Link from "next/link";
import { MdOutlineVerified, MdOutlineSchool, MdOutlineMenuBook, MdOutlineFavoriteBorder, MdOutlineArrowRightAlt } from "react-icons/md";

const QUALITIES = [
    { icon: <MdOutlineVerified />,       text: 'Trained and screened by LRC staff' },
    { icon: <MdOutlineSchool />,         text: 'Currently enrolled UPB students' },
    { icon: <MdOutlineMenuBook />,       text: 'Experts in their own fields of study' },
    { icon: <MdOutlineFavoriteBorder />, text: 'Committed to peer-driven learning' },
];

interface MentorQualitiesProps {
    imageURL: string | null
}

export default function MentorQualities({ imageURL }: MentorQualitiesProps) {
    return (
        <section className="py-16 border-b border-cream-border animate-fade-up [animation-delay:275ms]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                {/* Image */}
                <div className="aspect-[4/3] bg-cream-dark border border-cream-border overflow-hidden order-last lg:order-first">
                    <img
                        src={imageURL ?? ''}
                        alt="Our Mentors"
                        className="w-full h-full object-cover brightness-110"
                    />
                </div>

                {/* Content */}
                <div>
                    <div className="text-up-green text-xs font-bold tracking-widest uppercase mb-4">
                        Who are Mentors?
                    </div>
                    <p className="text-text-brown leading-7 mb-6">
                        Peer mentors are trained UPB students who have excelled in their fields. They undergo preparation to guide fellow students through academic challenges in a supportive, relatable environment.
                    </p>

                    <div className="flex flex-col gap-4">
                        {QUALITIES.map((item) => (
                            <div key={item.text} className="flex items-center gap-3">
                                <span className="text-up-maroon text-2xl flex-shrink-0">
                                    {item.icon}
                                </span>
                                <div className="text-sm text-text-brown">{item.text}</div>
                            </div>
                        ))}
                    </div>

                    {/* Mentor tab route */}
                    <div className="mt-6">
                        <Link
                            href="/mentors"
                            className="text-up-maroon font-bold text-xs inline-flex items-center gap-1 tracking-widest uppercase border-b border-up-maroon pt-2 hover:text-up-maroon/70 w-max"
                        >
                            Meet our Mentors
                            <MdOutlineArrowRightAlt className="text-2xl" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}