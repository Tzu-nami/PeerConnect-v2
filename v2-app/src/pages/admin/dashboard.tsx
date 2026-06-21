import Logout from '@/components/layout/Logout';
import ModuleLayout from "@/components/layout/ModuleLayout";
export default function AdminDashboard() {
    return (
        <ModuleLayout>
            <div>
                <h1>Hello Admin</h1>
                <Logout />
            </div>
        </ModuleLayout>
    );
};