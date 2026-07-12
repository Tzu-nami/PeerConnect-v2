import {GetServerSideProps} from "next";
import {createClient as serverClient} from "@/utils/supabase/server";
import {SystemSettings} from "@/types/systemSettings";
import {Semester} from "@/types/semester";
import {useRouter} from "next/router";
import AllowBookings from "@/components/admin/settings/AllowBookings";
import SemesterSetup from "@/components/admin/settings/SemesterSetup";
import { getAllSemesters } from '@/utils/services/sessionService';
import GenerateReport from "@/components/admin/settings/GenerateReport";

interface SettingsPageProps {
    systemSettings: SystemSettings
    currentSemester: Semester | null
    semesters: Semester[]
    selectedSemesterId: string | null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = serverClient(context)

    const [result1, semesters] = await Promise.all([
        supabase
            .from('system_settings')
            .select('*')
            .single(),

            getAllSemesters(supabase),
        ])

    const systemSettings = result1.data

    const currentSemester = semesters.find(s => s.is_current);
    const selectedSemesterId = (context.query.semester as string) ?? currentSemester?.id ?? null;

    return {
        props: {
            systemSettings: systemSettings ?? null,
            currentSemester: currentSemester ?? null,
            semesters,
            selectedSemesterId,
        }
    }
}

export default function SettingsPage({ systemSettings, currentSemester, semesters, selectedSemesterId }: SettingsPageProps) {
    const router = useRouter()

    const handleSemesterChange = (semesterId: string) => {
        router.push({ pathname: router.pathname, query: { semester: semesterId } });
    }

    return(
        <>
            {/* Page title */}
            <div className="border-b border-white-border">
                <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">System Settings</h1>
                <p className="text-xs md:text-sm xl:text-base font-medium text-text-muted mt-1 mb-3">Manage booking availability, announcements, and system-wide configurations</p>
            </div>

            <div className="grid grid-cols-2 gap-6 items-start">
                <SemesterSetup currentSemester={currentSemester?.term} currentAcadYear={currentSemester?.ay_start} currentSemStart={currentSemester?.semester_start} isCurrentActive={currentSemester?.is_current ?? false}  />
                <GenerateReport semesters={semesters} selectedSemesterId={selectedSemesterId} onSemesterChange={handleSemesterChange} />
                <AllowBookings initialEnabled={systemSettings?.bookings_enabled} initialDisableMessage={systemSettings?.disabled_message ?? ''} hasActiveSemester={currentSemester?.is_current ?? false}/>
            </div>

        </>
    )


}