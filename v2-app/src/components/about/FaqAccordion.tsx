'use client';

import { useState } from "react";

export interface FaqData {
    question: string;
    answer: React.ReactNode;
}

interface FaqAccordionProps {
    faqs: FaqData[];
    theme?: 'about' | 'services';
}

function FaqItem({ faq, theme }: { faq: FaqData, theme: 'about' | 'services'}) {
    const [open, setOpen] = useState(false);
    const isServices = theme === 'services';

    // CSS change depending on tab
    const itemClasses = isServices ? "py-5" : "px-5 py-4";
    const buttonClasses = isServices ? "w-full flex justify-between items-center text-left text-white font-semibold text-lg cursor-pointer" :
    "font-medium text-text-brown mb-1 w-full flex justify-between items-center text-left cursor-pointer";
    const answerClasses = isServices ? "mt-3 text-white/70 leading-7" : 
    "mt-2 text-sm text-text-brown-light leading-6";

    return (
        <div className={itemClasses}>
            <button className={buttonClasses}
            onClick={() => setOpen(!open)}>
                <span>{faq.question}</span>
                <span className="material-symbols-outlined transition-transform duration-300"
                style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    keyboard_arrow_down
                </span>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`} >
                <div className="overflow-hidden">
                    <div className={answerClasses}>
                        {faq.answer}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FaqAccordion({ faqs, theme = 'about' }: FaqAccordionProps) {
    const isServices = theme === 'services'

    // Border based on landing tab
    const containerClasses = isServices ? "flex flex-col divide-y divide-white/20" :
    "border border-cream-border divide-y divide-cream-border";
    return (
        <div className={containerClasses}>
            {faqs.map((faq, idx) => (
                <FaqItem key={idx} faq={faq} theme={theme} />
            ))}
        </div>
    );
}