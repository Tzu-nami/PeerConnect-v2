import Logout from "@/components/layout/Logout";
import {GetServerSideProps} from "next";
import {createClient} from "@/utils/supabase/server";

// Database connection
export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context)

    const [result] = await Promise.all([
        // SubjectList list
        supabase
            .from('subjects')
            .select('id, code, name'),
    ])

    const subjectList = result.data ?? []

    return {
        props: {
            subjectList
        }
    }
}

export default function Home() {
    return (
        <div>
            <h1>Hello Student</h1>
            <Logout />
        </div>
    );
};