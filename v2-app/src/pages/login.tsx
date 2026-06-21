import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setIsLoading(false);
        } else if (data.user) {
            const userRole = data.user.user_metadata?.role || 'student';
            const { redirectTo } = router.query;

            if (redirectTo === '/bookings') {
                router.replace(
                    userRole === 'student'
                        ? '/student/bookings'
                        : userRole === 'mentor'
                            ? '/mentor/bookings'
                            : `/${userRole}/dashboard`
                );
            } else {
                router.replace(`/${userRole}/dashboard`);
            }
        }
    };

    return (
        <>
            <div className="min-h-screen flex flex-col md:flex-row w-full overflow-hidden bg-gray-50 text-gray-900 antialiased">

                {/* Left column */}
                <div className="hidden md:flex w-1/2 bg-up-maroon relative flex-col justify-between p-12 lg:p-16 overflow-hidden">

                    <div className="relative z-10 flex flex-col items-center text-center animate-fade-in-down">
                        <Link href="/">
                            <img
                                src="https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/logos/LRC_logo.png"
                                alt="LRC Logo"
                                className="w-20 h-20 mb-8 drop-shadow-xl transition-transform hover:scale-110 duration-500 cursor-pointer"
                            />
                        </Link>

                        <h1 className="text-4xl lg:text-5xl font-extrabold font-sans text-white tracking-tight leading-tight">
                            LRC <span className="text-yellow-400">PeerConnect</span>
                        </h1>
                        <div className="h-1.5 w-16 bg-yellow-500 my-6 rounded-full"></div>
                    </div>

                    <div className="relative z-10 mt-12 group perspective-1000">
                        <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/30 to-white/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>

                        <div className="relative bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/20 shadow-2xl transform transition-all duration-700 group-hover:rotate-1 group-hover:scale-[1.03]">
                            <img
                                src="null"
                                alt="Student Peer Session"
                                className="rounded-xl w-full h-80 object-cover grayscale-[20%] group-hover:grayscale-0 transition duration-700 shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/10 flex justify-between items-center text-white/50 text-[10px] uppercase tracking-widest font-bold">
                        <span>University of the Philippines Baguio</span>
                        <span>Learning Resource Center</span>
                    </div>
                </div>

                {/* Mobile view */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative">
                    <div className="absolute top-8 left-0 right-0 flex flex-col items-center md:hidden">
                        <img
                            src="https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/logos/LRC_logo.png"
                            alt="LRC Logo"
                            className="w-16 h-16 mb-2"
                        />
                        <h2 className="text-xl font-bold text-up-maroon">LRC PeerConnect</h2>
                    </div>

                    {/* Right column */}
                    <div className="w-full max-w-md mt-16 md:mt-0 transition-all duration-500">

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Login form */}
                        <form onSubmit={handleEmailLogin} className="space-y-4">

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                />
                            </div>

                            <div className="block mt-4">
                                <label htmlFor="remember" className="inline-flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) => setRemember(e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className="ms-2 text-sm text-gray-600">Remember me</span>
                                </label>
                            </div>

                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {isLoading ? 'Logging in...' : 'Log in'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}