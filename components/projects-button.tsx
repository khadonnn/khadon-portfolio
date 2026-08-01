import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function ProjectsButton() {
    return (
        <a
            href='/projects'
            className='
        group relative isolate inline-flex items-center gap-2.5
        overflow-hidden rounded-full px-5 py-3
        text-sm font-medium
        bg-zinc-100/70 text-zinc-700
        dark:bg-white/5 dark:text-zinc-300
        backdrop-blur-md
        border border-zinc-200/70 dark:border-white/10
        transition-all duration-500 ease-out
        hover:bg-zinc-200/60 hover:text-zinc-900
        dark:hover:bg-white/[0.08] dark:hover:text-white
        hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)]
        dark:hover:shadow-[0_0_28px_-4px_rgba(255,255,255,0.12)]
        hover:border-zinc-300 dark:hover:border-white/25
        hover:-translate-y-0.5
      '
        >
            {/* Shine sweep */}
            <span
                className='
          pointer-events-none absolute inset-0
          -translate-x-full
          bg-gradient-to-r from-transparent via-white/50 to-transparent
          dark:via-white/15
          transition-transform duration-700 ease-in-out
          group-hover:translate-x-full
        '
            />

            <span
                className='
          relative z-10
          border-b border-zinc-400/50
          pb-0.5
          transition-all duration-300
          group-hover:border-zinc-600
          dark:border-white/25
          dark:group-hover:border-white/50
        '
            >
                View all projects
            </span>

            <ArrowUpRight
                size={17}
                className='
          relative z-10
          opacity-60
          transition-all duration-300 ease-out
          group-hover:translate-x-1 group-hover:-translate-y-1
          group-hover:opacity-100
          dark:group-hover:text-white
        '
            />
        </a>
    );
}
