import { useState } from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Icons
import { MdChevronRight } from "react-icons/md";
import { MdChevronLeft } from "react-icons/md";

const images = [
    { src: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/activities/Image-1.jpg", alt: "Activity 1" },
    { src: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/activities/Image-2.jpg", alt: "Activity 2" },
    { src: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/activities/Image-3.jpg", alt: "Activity 3" },
    { src: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/activities/Image-4.jpg", alt: "Activity 4" },
    { src: "https://yiwhpuvackxkdtayusgx.supabase.co/storage/v1/object/public/assets/images/activities/Image-5.jpg", alt: "Activity 5" },
];

export default function ActivitiesSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    return (
        <section className="w-full py-10 sm:py-16 md:py-20 bg-white overflow-hidden">
            <div className="px-4 sm:px-10 md:px-16 lg:px-28 xl:px-52 flex flex-col gap-4 mb-8 sm:mb-12">
                <div className="flex items-center gap-3 pb-4 sm:pb-5 border-b border-b-cream-dark">
                    <h1 className="font-heading text-up-maroon text-2xl sm:text-4xl md:text-5xl font-semibold tracking-wider">
                        Activities
                    </h1>
                    <span className="block w-8 h-px bg-up-green"></span>
                </div>
            </div>

            {/* Image carousel */}
            <div className="px-4 sm:px-8 lg:px-24 xl:px-40 activities-swiper">
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={{
                        nextEl: ".activities-next",
                        prevEl: ".activities-prev",
                    }}
                    pagination={{ clickable: true, el: ".activities-pagination" }}
                    loop={true}
                    initialSlide={2}
                    centeredSlides={true}
                    spaceBetween={16}
                    slidesPerView={1.1}
                    onSlideChange={(swiper: SwiperType) => setActiveSlide(swiper.realIndex)}
                    breakpoints={{
                        640: { slidesPerView: 1.2, spaceBetween: 16 },
                        768: { slidesPerView: 1.3, spaceBetween: 16 },
                        1024: { slidesPerView: 1.5, spaceBetween: 24 },
                        1280: { slidesPerView: 1.8, spaceBetween: 24 },
                    }}
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={image.src}>
                            <button
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className="block w-full"
                                style={{
                                    opacity: index === activeSlide ? 1 : 0.4,
                                    transition: "opacity 0.3s ease",
                                }}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    loading="lazy"
                                    className="w-full h-[200px] sm:h-[280px] lg:h-[400px] object-cover cursor-pointer"
                                />
                            </button>
                        </SwiperSlide>
                    ))}

                    <button
                        type="button"
                        className="activities-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-up-maroon/90 hover:bg-up-maroon text-white flex items-center justify-center shadow-md transition-colors cursor-pointer">
                        <MdChevronLeft size={22} />
                    </button>
                    <button
                        type="button"
                        className="activities-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-up-maroon/90 hover:bg-up-maroon text-white flex items-center justify-center shadow-md transition-colors cursor-pointer">
                        <MdChevronRight size={22} />
                    </button>
                </Swiper>

                {/* Custom pagination dots */}
                <div className="activities-pagination flex justify-center mt-6"></div>
            </div>

            <Lightbox
                open={activeIndex !== null}
                close={() => setActiveIndex(null)}
                slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
                index={activeIndex ?? 0}
                controller={{ closeOnBackdropClick: true }}
            />
        </section>
    );
}