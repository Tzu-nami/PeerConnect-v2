import { GetServerSideProps } from "next"
import {useEffect, useState} from "react"
import { useRouter } from "next/router"

// Components
import StaffTable from "@/components/admin/staff/StaffTable"
import AddStaffModal from "@/components/admin/staff/AddStaffModal"
import ViewStaffModal from "@/components/admin/staff/ViewStaffModal"
import EditStaffModal from "@/components/admin/staff/EditStaffModal"
import Pagination from "@/components/ui/Pagination"


// Utilities
import { createClient } from "@/utils/supabase/server"

// Types
import { StaffProfile } from "@/types/staff"
import { toast } from "sonner"
import DeleteStaffModal from "@/components/admin/staff/DeleteStaffModal"

// Database connection
export const getServerSideProps: GetServerSideProps = async(context) => {
    const supabase = createClient(context)
    const { data: staffList } = await supabase
        .from('staff_profiles')
        .select('*')
        .order('lastName', { ascending: true })
    return {
        props: { staffList: staffList ?? [] }
    }
}

export default function StaffManagement({ staffList }: { staffList: StaffProfile[] }) {
    // Router
    const router = useRouter()

    // Search
    const [searchQuery, setSearchQuery] = useState('')
    const filtered = staffList.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Pagination
    const ITEMS_PER_PAGE = 5
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    // Table sorting
    const [sortCol, setSortCol] = useState('lastName')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    function handleSort(col: string) {
        if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortCol(col); setSortDir('asc') }
    }

    // Modal states
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null)

    // Open staff modal from URL query
    useEffect(() => {
        const staffId = router.query.staffId

        if(staffId && typeof staffId === 'string' && staffList.length > 0) {
            const found = staffList.find((staff) => staff.id === staffId)

            if(found) {
                setSelectedStaff(found)
                setViewModalOpen(true)
            }
        }
    }, [router.query, staffList])

    return(
        <>
            {/* Page title */}
            <div className="border-b border-white-border">
                <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">Staff Management</h1>
                <p className="text-xs md:text-sm xl:text-base font-medium text-slate-500 mt-1 mb-3">LRC Registry Staff</p>
            </div>

            <StaffTable staffList={paginated} searchQuery={searchQuery} sortCol={sortCol} sortDir={sortDir} onSort={handleSort}
                onSearch={(q) => { setSearchQuery(q); setCurrentPage(1) }}
                onAdd={() => setAddModalOpen(true)}
                onView={(staff) => {
                    setSelectedStaff(staff)
                    setViewModalOpen(true)
                }}
                onEdit={(staff) => {
                    setSelectedStaff(staff)
                    setEditModalOpen(true)
                }}
                onDelete={(staff) => {
                    setSelectedStaff(staff)
                    setDeleteModalOpen(true)
                }} />

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            <AddStaffModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}
               onSuccess={() => {
                   router.replace(router.asPath)
                   toast.success("Staff member added successfully.")
               }} />

            <ViewStaffModal isOpen={viewModalOpen} staff={selectedStaff}
                onClose={() => {
                    setViewModalOpen(false)
                    setSelectedStaff(null)
                }} />

            <EditStaffModal isOpen={editModalOpen} staff={selectedStaff}
                onSuccess={() => {
                    router.replace(router.asPath)
                    toast.success("Staff member updated successfully.")
                }}
                onClose={() => {
                    setEditModalOpen(false)
                    setSelectedStaff(null)
                }} />

            <DeleteStaffModal isOpen={deleteModalOpen} staff={selectedStaff}
                onClose={() => {
                  setDeleteModalOpen(false)
                  setSelectedStaff(null)
                }}
                onSuccess={() => {
                  router.replace(router.asPath)
                  toast.success("Staff member deleted successfully.")
                }} />
        </>
    )
}