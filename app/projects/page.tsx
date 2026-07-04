import React from "react";
import Link from "next/link";

// Simple GitHub repo type (partial)
type Repo = {
    name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics?: string[];
    owner: { avatar_url: string };
    archived?: boolean;
};

const GITHUB_USER = "khadonnn";

async function fetchRepos(): Promise<Repo[]> {
    const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&direction=desc`,
    );

    if (!res.ok) return [];
    const data = await res.json();
    // filter out forks and sort by stargazers_count if available
    return (data as Repo[])
        .filter((r: any) => !r.fork)
        .sort(
            (a: any, b: any) =>
                (b.stargazers_count || 0) - (a.stargazers_count || 0),
        );
}

export default async function ProjectsPage() {
    const repos = await fetchRepos();

    return (
        <div className='-mt-20 py-8 max-w-6xl mx-auto px-4'>
            {/* Back to Home */}
            <Link
                href='/#home'
                className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group mb-8'
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='w-4 h-4 transition-transform group-hover:-translate-x-1'
                >
                    <path d='m15 18-6-6 6-6' />
                </svg>
                Back to Home
            </Link>

            <header className='mb-8'>
                <h1 className='text-4xl font-bold text-foreground'>
                    Projects gallery
                </h1>
                <p className='text-muted-foreground mt-2'>
                    A curated list of my public GitHub projects. Click any card
                    for details.
                </p>
            </header>

            <section className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {repos.map((repo) => (
                    <Link
                        key={repo.name}
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
                                    {repo.description ??
                                        "No description provided."}
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
                ))}
            </section>
        </div>
    );
}
