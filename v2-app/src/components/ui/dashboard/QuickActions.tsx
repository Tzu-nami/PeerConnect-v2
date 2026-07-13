import {MdLibraryAdd, MdPersonAddAlt1} from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import Link from "next/link"

export default function QuickActions() {
    return(
        <div className="rounded-xl shadow-sm border border-white-border flex-1 px-4 py-3 text-sm ">
           <p className="font-bold mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <Link href="/admin/mentors?action=add" className="w-full flex gap-2 items-center justify-center border border-white-border rounded-md py-2 hover:bg-white-hover cursor-pointer">
                        <MdPersonAddAlt1 className="text-base" />
                        <span className="font-semibold">Add Mentor</span>
                    </Link>
                    <Link href="/admin/courses?action=add"  className="w-full flex gap-2 items-center justify-center border border-white-border rounded-md py-2 hover:bg-white-hover cursor-pointer">
                        <MdLibraryAdd className="text-base" />
                        <span className="font-semibold">Add Subject</span>
                    </Link>
                </div>

                <Link href="/admin/settings" className="w-full flex gap-2 items-center justify-center border border-white-border rounded-md py-2 hover:bg-white-hover cursor-pointer">
                    <FaFileAlt className="text-base" />
                    <span className="font-semibold">Generate Report</span>
                </Link>
            </div>
        </div>
    )
}