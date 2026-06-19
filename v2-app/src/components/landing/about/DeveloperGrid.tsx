const DEVELOPERS = [
    { name: "Ax'l Jhone David P. Conchada", course: 'BS Computer Science' },
    { name: "Daniel Joco B. Dyoco", course: 'BS Computer Science' },
    { name: "Rhona Shayne B. Lopez", course: 'BS Computer Science' },
    { name: "Frian Karl C. Nabo", course: 'BS Computer Science' },
    { name: "Vonn Jerriel V. Rosario", course: 'BS Computer Science' },
];

export default function DeveloperGrid() {
    const rows = [];
    for (let i = 0; i < DEVELOPERS.length; i += 2) {
        rows.push(DEVELOPERS.slice(i, i + 2));
    }

    return (
        <section className="py-8 animate-fade-up [animation-delay:325ms]">
            <div className="text-up-yellow text-xs font-bold tracking-widest uppercase mb-4">
                Developed By
            </div>
            <div className="border border-cream-border divide-y divide-cream-border">
                {rows.map((pair, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-cream-border">
                        {pair.map((dev) => (
                            <div key={dev.name} className="px-5 py-4">
                                <div className="font-medium text-sm">{dev.name}</div>
                                <div className="text-xs text-text-brown-light mt-1">{dev.course}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="text-xs text-text-brown-light tracking-wide mt-3">
                University of the Philippines Baguio | 2025 - 2026
            </div>
        </section>
    );
}