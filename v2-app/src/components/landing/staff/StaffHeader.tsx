export default function StaffHeader() {
    return(
        <section className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-20 py-10 gap-6">
            <div className="flex flex-col gap-4 animate-fade-up">
                <div className="flex items-center gap-3 text-up-green text-xs tracking-widest font-bold uppercase">
                    <span className="block w-8 h-px bg-up-green"></span>Our Team
                </div>
                <h1 className="font-heading text-up-maroon text-4xl md:text-5xl font-semibold tracking-wider">
                    Meet the Staff
                </h1>
            </div>
            <div className="text-text-brown leading-7 border-l-0 md:border-l border-up-green pl-0 md:pl-5 self-center animate-fade-up">
                The LRC staff oversee and manage the PeerConnect platform, ensuring that every session runs smoothly and that students get the support they need.
            </div>
        </section>
    )
}