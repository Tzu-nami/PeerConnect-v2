import { useState, useMemo } from "react"
import Link from  "next/link"

// Constants
import { ROLE_LABELS } from "@/constants/roleLabels"
import { STATUS_LABELS } from "@/constants/statusLabels"

// Hooks
import { useClickOutside } from "@/hooks/useClickOutside"

// Icons
import { FaChalkboardTeacher, FaSearch, FaCalendarCheck } from "react-icons/fa"
import { FaUserTie, FaBookOpen } from "react-icons/fa6"
import { MdOutlineSearchOff } from "react-icons/md"

// Types
import { MentorList } from "@/types/mentorList"
import { SessionList } from "@/types/sessionList"
import { StaffList } from "@/types/staffList"
import { SubjectList } from "@/types/subjectList"

interface GlobalSearchProps {
    mentorList?: MentorList[]
    sessionList?: SessionList[]
    staffList?: StaffList[]
    subjectList?: SubjectList[]
    placeholder: string
    role: string
}

export default function GlobalSearch({ mentorList, sessionList, staffList, subjectList, placeholder, role }: GlobalSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useClickOutside(showDropdown, () => setShowDropdown(false))
    const basePath = `/${role}`

    // Filter mentors on search
    const filteredMentors = useMemo(() => {
        if(searchQuery.length === 0) return []
        const query = searchQuery.toLowerCase()

        return mentorList?.filter((mentor) => (
            mentor.mentorName?.toLowerCase().includes(query) ||
            mentor.email?.toLowerCase().includes(query) ||
            mentor.yearLevel?.toLowerCase().includes(query) ||
            mentor.degreeProgram?.toLowerCase().includes(query)
        )) ?? []
    }, [searchQuery, mentorList])

    // Filter sessions on search
    const filteredSessions = useMemo(() => {
        if(searchQuery.length === 0) return []
        const query = searchQuery.toLowerCase()

        return sessionList?.filter((session) => (
            session.topic?.toLowerCase().includes(query) ||
            session.bookingStatus?.toLowerCase().includes(query) ||
            session.subject?.toLowerCase().includes(query) ||
            session.mode?.toLowerCase().includes(query) ||
            session.mentorName?.toLowerCase().includes(query) ||
            session.studentName?.toLowerCase().includes(query)
        )) ?? []
    }, [searchQuery, sessionList])

    // Filter staff on search
    const filteredStaff = useMemo(() => {
        if(searchQuery.length === 0) return []
        const query = searchQuery.toLowerCase()

        return staffList?.filter((staff) => (
            staff.staff_name?.toLowerCase().includes(query) ||
            staff.role?.toLowerCase().includes(query) ||
            staff.email?.toLowerCase().includes(query)
        )) ?? []
    }, [searchQuery, staffList])

    // Filter subjects on search
    const filteredSubjects = useMemo(() => {
        if(searchQuery.length === 0) return []
        const query = searchQuery.toLowerCase()

        return subjectList?.filter((subject) => (
            subject.code?.toLowerCase().includes(query) ||
            subject.name?.toLowerCase().includes(query)
        )) ?? []
    }, [searchQuery, subjectList])

    const hasResults = filteredMentors.length > 0 || filteredSessions.length > 0 || filteredStaff.length > 0 || filteredSubjects.length > 0

    return(
        <div className="relative bg-white rounded-xl shadow-sm border border-stone-100 mb-4">
            <div className="relative p-3">
                <FaSearch className="absolute text-stone-400 left-[24px] top-1/2 -translate-y-1/2" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setShowDropdown(true)}
                       type="text" placeholder={placeholder} autoComplete="off"
                       className="w-full pl-[34px] rounded-lg border placeholder-stone-400 border-cream-border text-sm font-medium focus:ring-1 focus:ring-text-brown"/>

                {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setShowDropdown(false)}}
                            className="absolute text-stone-400 hover:text-red-700 text-sm font-bold right-7 top-1/2 -translate-y-1/2 transition cursor-pointer">✕</button>
                )}
            </div>

            {/* Show dropdown when the search query matches the stored data */}
            {showDropdown && hasResults && (
                <div ref={dropdownRef} className="absolute bg-white  w-full mt-2 rounded-xl shadow-md z-50 overflow-hidden max-h-96 overflow-y-auto">

                    {/* Mentor search result */}
                    {filteredMentors.length > 0 && (
                        <div>
                            <p className="font-extrabold tracking-widest text-[11px] bg-cream-dark px-5 py-3 uppercase">Mentors</p>
                            <ul className="flex flex-col">
                                {filteredMentors.map((mentor) => {
                                    const details = `${mentor.email} | ${mentor.yearLevel} | ${mentor.degreeProgram}`

                                    return(
                                       <li key={mentor.id} className="border-b border-cream-border hover:bg-stone-100 last:border-b-0">
                                           <Link href={`${basePath}/mentors?mentorId=${mentor.id}`} onClick={() => setShowDropdown(false)}
                                                 className="text-sm flex items-center px-5">
                                               <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                                                   <FaChalkboardTeacher className="text-lg" />
                                               </div>
                                               <div className="flex flex-col p-3 gap-[6px] ">
                                                   <span className="font-bold">{mentor.mentorName}</span>
                                                   <span className="text-xs text-text-brown-light">{details}</span>
                                               </div>
                                           </Link>
                                       </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Staff search result */}
                    {filteredStaff.length > 0 && (
                        <div>
                            <p className="font-extrabold tracking-widest text-[11px] bg-cream-dark px-5 py-3 uppercase">Staff</p>
                            <ul className="flex flex-col">
                                {filteredStaff.map((staff) => {
                                    const staffRole = ROLE_LABELS[staff.role]
                                    const details = `${staff.email} | ${staffRole}`

                                    return(
                                        <li key={staff.id} className="border-b border-cream-border hover:bg-stone-100 last:border-b-0">
                                            <Link href={`/admin/staff?staffId=${staff.id}`} onClick={() => setShowDropdown(false)}
                                                  className="text-sm flex items-center px-5">
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                    <FaUserTie className="text-lg" />
                                                </div>
                                                <div className="flex flex-col p-3 gap-[6px] ">
                                                    <span className="font-bold">{staff.staff_name}</span>
                                                    <span className="text-xs text-text-brown-light">{details}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Session search result */}
                    {filteredSessions.length > 0 && (
                        <div>
                            <p className="font-extrabold tracking-widest text-[11px] bg-cream-dark px-5 py-3 uppercase">Sessions</p>
                            <ul className="flex flex-col">
                                {filteredSessions.map((session) => {
                                    const topic = `${session.subject} — ${session.topic}`
                                    const status = STATUS_LABELS[session.bookingStatus]
                                    const details = `${session.mentorName} → ${session.studentName} | ${session.mode} | ${status}`

                                    return(
                                        <li key={session.id} className="border-b border-cream-border hover:bg-stone-100 last:border-b-0">
                                            <Link href={`${basePath}/sessions?sessionId=${session.id}`} onClick={() => setShowDropdown(false)}
                                                  className="text-sm flex items-center px-5">
                                                <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                                                    <FaCalendarCheck className="text-lg" />
                                                </div>
                                                <div className="flex flex-col p-3 gap-[6px] ">
                                                    <span className="font-bold">{topic}</span>
                                                    <span className="text-xs text-text-brown-light">{details}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}

                    {filteredSubjects.length > 0 && (
                        <div>
                            <p className="font-extrabold tracking-widest text-[11px] bg-cream-dark px-5 py-3 uppercase">Subjects</p>
                            <ul className="flex flex-col">
                                {filteredSubjects.map((subject) => {
                                    return(
                                        <li key={subject.id} className="border-b border-cream-border hover:bg-stone-100 last:border-b-0">
                                            <Link href={`${basePath}/mentors?subjectId=${subject.id}`} onClick={() => setShowDropdown(false)}
                                                  className="text-sm flex items-center px-5">
                                                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                                    <FaBookOpen className="text-lg" />
                                                </div>
                                                <div className="flex flex-col p-3 gap-[6px] ">
                                                    <span className="font-bold">{subject.code}</span>
                                                    <span className="text-xs text-text-brown-light">{subject.name}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            ) }

            {showDropdown && searchQuery && !hasResults && (
                <div ref={dropdownRef} className="absolute bg-white  w-full mt-1 rounded-xl shadow-md z-50 overflow-hidden h-32 flex items-center justify-center">
                   <div className="flex items-center gap-2 italic text-text-brown-light">
                       <MdOutlineSearchOff className="text-2xl" />
                       <p className="text-sm">No matches found for <span className="font-bold">{searchQuery}</span></p>
                   </div>
                </div>
            )}
        </div>
    )
}