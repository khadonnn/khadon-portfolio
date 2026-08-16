import React from "react";
import Link from "next/link";
import GithubRepoGrid, { type Repo } from "@/components/github-repo-grid";

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

            <GithubRepoGrid repos={repos} />
        </div>
    );
}
