import Image from "next/image"
import Link from "next/link"

// Types
import type {StaffProfile} from "@/types/staff"

// Constants
import { ROLE_LABELS } from "@/constants/roleLabels"

// Icons
import {FaUser} from "react-icons/fa"
import {IoMailOutline} from "react-icons/io5"

export default function StaffGrid({ staffList }: {  staffList: StaffProfile[] }) {
    return (
        <section
            className="px-6 md:px-20 lg:px-40 xl:px-64 pb-20 border-t border-cream-border pt-12 animate-fade-up [animation-delay:150ms]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 items-stretch">
                {staffList.map((staff, index) => {
                    const role = ROLE_LABELS[staff.role];
                    const isLastOdd = staffList.length % 2 !== 0;
                    const isLastItem = index === staffList.length - 1;

                    return (
                        <div key={staff.id} className={`flex flex-col border border-cream-border rounded-sm overflow-hidden 
                                                ${isLastOdd && isLastItem ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto sm:self-start' : ''}`}>
                            <div className="flex flex-col justify-center items-center gap-4 bg-up-green py-4 px-8">
                                {staff.avatar
                                    ? (
                                        <div className="w-24 h-24 rounded-sm overflow-hidden shrink-0">
                                            <Image
                                                src={staff.avatar}
                                                alt={role}
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )
                                    : <div className="w-24 h-24 rounded-sm bg-white shrink-0"/>
                                }
                                <div className="text-center">
                                    <div className="text-lg font-heading text-cream font-bold">
                                        {staff.firstName} {staff.middleInitial ? `${staff.middleInitial} ` : ''}{staff.lastName}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="flex flex-col flex-1 justify-center divide-y divide-cream-border text-sm text-text-brown">
                                <div className="flex items-center gap-3 px-6 py-3">
                                    <FaUser className="text-up-maroon shrink-0"/>
                                    <span className="truncate">{role}</span>
                                </div>
                                <div>
                                    <Link href={`https://mail.google.com/mail/?view=cm&fs=1&to=${staff.email}`}
                                          target="_blank" rel="noopener noreferrer"
                                          className="inline-flex items-center gap-3 px-6 py-3 hover:text-up-maroon">
                                        <IoMailOutline className="text-up-maroon shrink-0"/>
                                        <span className="truncate">{staff.email}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )})
                }
            </div>
        </section>
    )
}