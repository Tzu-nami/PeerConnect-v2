import {GetServerSideProps} from "next";
import {createClient as serverClient} from "@/utils/supabase/server";
import {createClient} from "@/utils/supabase/client";
import { LandingImages } from "@/types/landingImages"
import {useRouter} from "next/router";
import {useState} from "react";
import { toast } from "sonner"
import { RiImageEditFill } from "react-icons/ri";


interface ImageCardProps {
    image: LandingImages
}

interface ImageManagementProps {
    landingImages: LandingImages[]
}

const SECTIONS = [
    { title: 'Hero Section',        ids: ['hero_bg'] },
    { title: 'Services Section',    ids: ['one_on_one', 'group_sessions', 'review_classes'] },
    { title: 'Carousel Section',    ids: ['carousel_1', 'carousel_2', 'carousel_3', 'carousel_4', 'carousel_5'] },
    { title: 'About Us Section',    ids: ['about_banner', 'mentors_staff', 'lrc_mission'] }
]

function ImageCard({ image }: ImageCardProps) {
    const [uploading, setUploading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)

        const fileName = `images/${image.slot_key}/${file.name}`

        const { error: uploadError } = await supabase.storage
            .from('assets')
            .upload(fileName, file, { upsert: true })

        if (uploadError) {
            toast.error('Failed to save: ' + uploadError.message)
            setUploading(false)
            return
        }

        const { data: urlData } = supabase.storage.from('assets').getPublicUrl(fileName)

        const { error: updateError } = await supabase
            .from('landing_images')
            .update({ image_url: urlData.publicUrl, updated_at: new Date().toISOString() })
            .eq('id', image.id)

        if (updateError) {
            toast.error('Failed to save: ' + updateError.message)
            setUploading(false)
            return
        }

        toast.success(`${image.label} updated successfully!`)
        setUploading(false)
        router.replace(router.asPath)
    }

    return(
        <label className="relative block aspect-video rounded-xl overflow-hidden cursor-pointer group border border-white-border shadow-sm">
            {/* Image preview */}
            {image.image_url ? (
                <img src={image.image_url} alt={image.label} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-white-dark flex items-center justify-center">
                    <RiImageEditFill  className="text-4xl text-text-muted" />
                </div>
            )}

            {/* Edit image badge */}
            <div className="absolute bottom-3 right-3 bg-black/60 rounded-full p-1.5 group-hover:opacity-0 transition-opacity">
                <RiImageEditFill  className="text-white" />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <span className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-semibold">
                    <div className="flex items-center gap-2">
                        <RiImageEditFill className="text-2xl"  />
                        <p>{uploading ? 'Uploading...' : 'Upload/Update Image'}</p>
                    </div>
                    <p>{image.label}</p>
                </span>
            </div>

            <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = serverClient(context)
    const { data: landingImages } = await supabase
        .from('landing_images')
        .select('*')
        .order('id')
    return {
        props: { landingImages: landingImages ?? [] }
    }
}

export default function ImageManagement({ landingImages }: ImageManagementProps) {
    const imageMap = Object.fromEntries(landingImages.map((image) => [image.slot_key, image]))

    return(
        <>
            {/* Page title */}
            <div className="border-b border-white-border">
                <h1 className="text-xl md:text-2xl xl:text-3xl font-extrabold tracking-tight text-up-maroon">Landing Page Image Management</h1>
                <p className="text-xs md:text-sm xl:text-base font-medium text-text-muted mt-1 mb-3">Update and manage images displayed across the landing page</p>
            </div>

            <div className="flex flex-col gap-6 mt-5">
                {SECTIONS.map((section) => (
                    <div key={section.title} className="bg-white rounded-xl shadow-sm border border-white-border">
                        <div className="bg-text-primary rounded-t-xl">
                            <p className="text-white text-xl px-3 py-2 font-semibold">{section.title}</p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-3">
                            {section.ids.map((id) => {
                                const image = imageMap[id]
                                if (!image) return null
                                return <ImageCard key={id} image={image} />
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}