import type { GetServerSideProps } from "next"

// Components
import ServicesDetail from "@/components/landing/services/ServicesDetail"

// Utilities
import { getServerSideUserRole } from "@/utils/getServerSideUserRole"
import { createClient } from "@/utils/supabase/server"
import { LandingImages } from "@/types/landingImages"

interface ServicesPageProps {
    userRole: string | null
    images: Record<string, string | null>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userRole = await getServerSideUserRole(context)
    const supabase = createClient(context)

    const { data: landingImages } = await supabase
        .from('landing_images')
        .select('*')
        .order('id')

    const images = Object.fromEntries(
        (landingImages ?? []).map((image: LandingImages) => [image.slot_key, image.image_url])
    )

    return {
        props: { userRole, images }
    }
}

export default function ServicesPage({ images }: ServicesPageProps) {
    return (
        <ServicesDetail images={images} />
    )
}