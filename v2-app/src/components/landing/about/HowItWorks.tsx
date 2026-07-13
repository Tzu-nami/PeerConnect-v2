import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
const STEPS = [
    { number: 1, title: 'Log in', desc: 'Sign in using your UP email account.' },
    { number: 2, title: 'Book a session', desc: 'Pick a mentor, subject, date, and time.' },
    { number: 3, title: 'Wait for approval', desc: 'Your booking is reviewed by LRC staff.' },
    { number: 4, title: 'Attend', desc: 'Show up, ask questions, and learn actively.' },
    { number: 5, title: 'Leave a review', desc: 'Rate your session to help others.' },
];

export default function HowItWorks() {
    const supabase = createClient();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);
        const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback`,
        },
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
        }
    }
    return (
        <>
            {isLoading && (
                <div className="fixed inset-0 z-[9999] backdrop-blur-sm flex items-center justify-center">
                    <div className="loader"></div>
                </div>
            )}
            <section className="py-16 border-b border-white-border animate-fade-up [animation-delay:250ms]">
                <div className="text-up-green text-xs font-bold tracking-widest uppercase mb-10">
                    How it Works
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                    {STEPS.map((step, i) => {
                        const isLoginStep = step.number === 1;
                        const borderClasses = i < STEPS.length - 1 ? 'border-b md:border-b-0 md:border-r border-white-border' : '';
                        const layoutClasses = "flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center px-4 md:px-3 py-6 md:py-2 h-full rounded-lg";
                        const innerContent = (
                            <>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-up-maroon text-white text-sm font-semibold flex items-center justify-center">
                                    {step.number}
                                </div>
                                <div>
                                    <div className="font-medium text-text-primary">
                                        {step.title} {isLoginStep && <span aria-hidden="true">→</span>}
                                    </div>
                                    <div className="text-sm text-text-white-light leading-5 mt-1">{step.desc}</div>
                                </div>
                            </>
                        );
                        if (isLoginStep) {
                            return (
                                <button 
                                    key={step.number} 
                                    onClick={handleGoogleLogin}
                                    className={`${layoutClasses} ${borderClasses} hover:bg-white-hover transition-colors cursor-pointer group`}
                                >
                                    {innerContent}
                                </button>
                            );
                        }
                        return (
                            <div key={step.number} className={`${layoutClasses} ${borderClasses}`}>
                                {innerContent}
                            </div>
                        );
                    })}
                </div>
            </section>
        </>
    );
}