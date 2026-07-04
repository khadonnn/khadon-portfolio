import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsButton() {
    return (
        <a
            href='/projects'
            className='dark:bg-white/10 group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full bg-card px-5 py-3 text-sm font-medium text-foreground/85 backdrop-blur-sm transition-all duration-300 hover:bg-muted/80 hover:text-foreground hover:shadow-[0_0_24px_rgba(15,23,42,0.08)] dark:hover:bg-white/5 dark:hover:shadow-[0_0_24px_rgba(34,211,238,0.18)]'
        >
            <span className='firefly-field pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                <span className='firefly firefly-1' />
                <span className='firefly firefly-2' />
                <span className='firefly firefly-3' />
                <span className='firefly firefly-4' />
                <span className='firefly firefly-5' />
                <span className='firefly firefly-6' />
                <span className='firefly firefly-7' />
                <span className='firefly firefly-8' />
            </span>

            <span className='relative z-10  border-b border-foreground/20 pb-0.5 transition-colors duration-300 group-hover:border-foreground/40 dark:border-white/20 dark:group-hover:border-cyan-300/60'>
                View all projects
            </span>
            <ArrowUpRight
                className='relative z-10 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 dark:group-hover:text-cyan-200'
                size={18}
            />
        </a>
    );
}
