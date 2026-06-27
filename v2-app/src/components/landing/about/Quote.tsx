import { FaQuoteLeft } from "react-icons/fa6";
interface QuoteProps {
    author: string;
}

export default function Quote({ author }: QuoteProps) {
    return (
        <section className="py-16 border-b border-cream-border animate-fade-up [animation-delay:250ms]">
            <div className="max-w-3xl mx-auto text-center">
                <FaQuoteLeft className="text-4xl text-cream-border block mb-6" />
                <p className="italic text-text-brown leading-9 text-xl md:text-2xl mb-6">
                "At the LRC, we believe that every student has the capacity to succeed.
                Sometimes, all they need is the right peer beside them."
                </p>
                <div className="w-8 h-px bg-up-yellow mx-auto mb-4"></div>
                <p className="text-text-brown-light text-xs tracking-widest uppercase">
                — {author}, LRC Head
                </p>
            </div>
        </section>
    );
}