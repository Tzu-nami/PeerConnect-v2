import { useEffect, useState} from "react";
import { createClient} from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import LandingLayout from "@/components/layout/LandingLayout";

import { FaUser } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";

type StaffProfile = {
    id: string;
    firstName: string;
    middleInitial: string | null;
    lastName: string;
    role: string;
    email: string;
    avatar: string | null;
}

export default function Staff() {
    const [staffList, setStaffList] = useState<StaffProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const roleLabels: Record<string, string> = {
        lrc_head: 'LRC Head',
        lrc_assistant: 'LRC Assistant',
        student_assistant: 'Student Assistant',
    };

    useEffect(() => {
        const supabase = createClient();
        supabase.from('staff_profiles').select('*').then((result) => {
            setStaffList(result.data ?? []);
            setLoading(false);
        })
    }, []);

    return(
        <LandingLayout>
            <section className="px-6 md:px-20 py-10 gap-6">
                <div className="flex flex-col gap-4 animate-fade-up">
                    <div className="flex items-center gap-3 text-up-green text-xs tracking-widest font-bold uppercase">
                        <span className="block w-8 h-px bg-up-green"></span>Our Team
                    </div>
                    <h1 className="font-heading text-up-maroon text-4xl md:text-5xl font-semibold tracking-wider">Meet the Staff</h1>
                    <p>
                        The LRC staff oversee and manage the PeerConnect platform, ensuring that every session runs smoothly and that students get the support they need.
                    </p>
                </div>
            </section>

            <section className="px-6 md:px-20 lg:px-40 xl:px-64 pb-20 border-t border-cream-border pt-12 animate-fade-up [animation-delay:150ms]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 items-stretch">
                    {loading
                        ? Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="flex flex-col border border-cream-border rounded-sm overflow-hidden animate-pulse">
                                <div className="flex flex-col justify-center items-center gap-4 bg-up-green py-4 px-8">
                                    <div className="w-20 h-20 rounded-full bg-white/20" />
                                    <div className="h-4 w-32 bg-white/20 rounded" />
                                </div>
                                <div className="flex flex-col divide-y divide-cream-border">
                                    <div className="px-6 py-3">
                                        <div className="h-3 w-24 bg-cream-border rounded" />
                                    </div>
                                    <div className="px-6 py-3">
                                        <div className="h-3 w-40 bg-cream-border rounded" />
                                    </div>
                                </div>
                            </div>
                        ))
                        : staffList.map((staff, index) => {
                            const role = roleLabels[staff.role];
                            const isLastOdd = staffList.length % 2 !== 0;
                            const isLastItem = index === staffList.length - 1;

                            return (
                                <div key={staff.id} className={`flex flex-col border border-cream-border rounded-sm overflow-hidden 
                                                    ${isLastOdd && isLastItem ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto sm:self-start' : ''}`}>
                                    <div className="flex flex-col justify-center items-center gap-4 bg-up-green py-4 px-8">
                                        {staff.avatar
                                            ? <Image src={staff.avatar} alt={role} width={80} height={80} />
                                            : <div className="w-20 h-20 rounded-full bg-white" />
                                        }
                                        <div className="text-center">
                                            <div className="text-lg font-heading text-cream font-bold">
                                                {staff.firstName} {staff.middleInitial ? `${staff.middleInitial} ` : ''}{staff.lastName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-1 justify-center divide-y divide-cream-border text-sm text-text-brown">
                                        <div className="flex items-center gap-3 px-6 py-3">
                                            <FaUser className="text-up-maroon shrink-0"/>
                                            <span className="truncate">{role}</span>
                                        </div>
                                        <div>
                                            <Link href={`https://mail.google.com/mail/?view=cm&fs=1&to=${staff.email}`} target="_blank" rel="noopener noreferrer"
                                                  className="inline-flex items-center gap-3 px-6 py-3 hover:text-up-maroon">
                                                <IoMailOutline className="text-up-maroon shrink-0" />
                                                <span className="truncate">{staff.email}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </section>
        </LandingLayout>
    )
};