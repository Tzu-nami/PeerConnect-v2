const STEPS = [
    { number: 1, title: 'Log in', desc: 'Sign in using your UP email account.' },
    { number: 2, title: 'Book a session', desc: 'Pick a mentor, subject, date, and time.' },
    { number: 3, title: 'Wait for approval', desc: 'Your booking is reviewed by LRC staff.' },
    { number: 4, title: 'Attend', desc: 'Show up, ask questions, and learn actively.' },
    { number: 5, title: 'Leave a review', desc: 'Rate your session to help others.' },
];

export default function HowItWorks() {
    return (
        <section className="py-16 border-b border-cream-border animate-fade-up [animation-delay:250ms]">
            <div className="text-up-green text-xs font-bold tracking-widest uppercase mb-10">
                How it Works
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                {STEPS.map((step, i) => (
                    <div key={step.number} className={`flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center px-0 md:px-3 py-6 md:py-0 ${
                        i < STEPS.length - 1 ? 'border-b md:border-b-0 md:border-r border-cream-border' : ''
                    }`}>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-up-maroon text-cream text-sm font-semibold flex items-center justify-center">
                            {step.number}
                        </div>
                        <div>
                            <div className="font-medium text-text-brown">{step.title}</div>
                            <div className="text-sm text-text-brown-light leading-5 mt-1">{step.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}