import React from 'react';

interface Stat {
    value: number | string;
    label: React.ReactNode;
}

interface StatsDisplayProps {
    stats: Stat[];
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
    return (
        <section className="grid grid-cols-3 border-b border-cream-border animate-fade-up [animation-delay:150ms]">
            {stats.map((stat, i) => (
                <div key={i} className={`text-center py-8 sm:py-12 px-1 sm:px-4 ${i < stats.length - 1 ? 'border-r border-cream-border' : ''}`}>
                    <div className="font-heading text-4xl sm:text-5xl md:text-6xl text-up-maroon mb-2">
                        {stat.value}
                    </div>
                    <div className="text-up-yellow text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase">
                        {stat.label}
                    </div>
                </div>
            ))}
        </section>
    );
}