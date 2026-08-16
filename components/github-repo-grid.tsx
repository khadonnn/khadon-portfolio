"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

// Number of repos revealed on each "load more" batch.
const PAGE_SIZE = 6;

export type Repo = {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics?: string[];
    owner: { avatar_url: string };
    archived?: boolean;
    fork?: boolean;
    stargazers_count?: number;
};

function RepoCard({ repo }: { repo: Repo }) {
    return (
        <Link
            href={`/projects/${repo.name}`}
            className='group relative block overflow-hidden rounded-lg border border-border/40 bg-card/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border/70 hover:bg-muted/40 hover:shadow-[0_0_24px_rgba(15,23,42,0.08)] dark:hover:border-cyan-400/40 dark:hover:bg-white/5 dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]'
        >
            <span className='pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                <span className='repo-particle repo-particle-1' />
                <span className='repo-particle repo-particle-2' />
                <span className='repo-particle repo-particle-3' />
                <span className='repo-particle repo-particle-4' />
                <span className='repo-particle repo-particle-5' />
                <span className='repo-particle repo-particle-6' />
                <span className='repo-particle repo-particle-7' />
                <span className='repo-particle repo-particle-8' />
                <span className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(71,85,105,0.07),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(71,85,105,0.05),transparent_35%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_35%)]' />
            </span>

            <div className='flex items-start justify-between gap-4'>
                <div className='relative z-10 flex-1'>
                    <h2 className='text-xl font-semibold text-foreground'>
                        {repo.name}
                    </h2>
                    <p className='mt-2 text-muted-foreground leading-relaxed text-sm'>
                        {repo.description ?? "No description provided."}
                    </p>

                    <div className='flex flex-wrap gap-2 mt-4'>
                        {((repo.topics && repo.topics.length) ||
                            repo.language) && (
                            <>
                                {repo.topics &&
                                    repo.topics
                                        .slice(0, 5)
                                        .map((t) => (
                                            <span
                                                key={t}
                                                className='inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border/40'
                                            >
                                                {t}
                                            </span>
                                        ))}

                                {repo.language && (
                                    <span className='inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border/40'>
                                        {repo.language}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className='relative z-10 ml-4 flex-shrink-0'>
                    <img
                        src={repo.owner.avatar_url}
                        alt={repo.name}
                        width={64}
                        height={64}
                        className='rounded-md'
                    />
                </div>
            </div>
        </Link>
    );
}

export default function GithubRepoGrid({ repos }: { repos: Repo[] }) {
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const isLoading = useRef(false);

    // Sentinel: this element sits below the grid. Once it scrolls into view
    // (with a 300px lookahead), the next batch of repos gets appended.
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "0px 0px 300px 0px",
    });

    const hasMore = visibleCount < repos.length;

    useEffect(() => {
        if (!inView || !hasMore || isLoading.current) return;

        isLoading.current = true;
        const id = window.setTimeout(() => {
            setVisibleCount((count) =>
                Math.min(count + PAGE_SIZE, repos.length),
            );
            isLoading.current = false;
        }, 200);

        return () => window.clearTimeout(id);
    }, [inView, hasMore, repos.length]);

    if (repos.length === 0) {
        return (
            <p className='py-12 text-center text-sm text-muted-foreground'>
                No public projects found right now.
            </p>
        );
    }

    const visibleRepos = repos.slice(0, visibleCount);

    return (
        <>
            <section className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {visibleRepos.map((repo) => (
                    <RepoCard key={repo.name} repo={repo} />
                ))}
            </section>

            {hasMore ? (
                <div
                    ref={ref}
                    className='flex min-h-[7rem] items-center justify-center'
                >
                    <span className='flex items-center gap-3 text-sm text-muted-foreground'>
                        <span
                            aria-hidden
                            className='h-4 w-4 animate-spin rounded-full border-2 border-border/50 border-t-cyan-400'
                        />
                        Loading more projects
                    </span>
                </div>
            ) : (
                <p className='py-10 text-center text-xs uppercase tracking-widest text-muted-foreground/70'>
                    End of list · {repos.length} public projects
                </p>
            )}
        </>
    );
}