interface MissionProps {
    imageURL: string | null
}

export default function Mission({ imageURL }: MissionProps) {
    return (
        <section className="py-16 border-b border-white-border animate-fade-up [animation-delay:200ms]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                    <div className="text-up-green text-xs font-bold tracking-widest uppercase mb-4">
                        Our Mission
                    </div>
                    <p className="text-text-primary leading-8 text-lg">
                        The Learning Resource Center exists to empower every UPB student with the academic
                        tools, guidance, and peer support they need to succeed — making quality learning
                        assistance accessible to all.
                    </p>
                </div>
                <div className="aspect-[4/3] bg-white-dark border border-white-border overflow-hidden">
                    <img
                        src={imageURL ?? ''}
                        alt="Our Mission"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
}