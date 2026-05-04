import React from "react";
import ProjectDetail, {
    Project as DetailProject,
} from "@/components/project-detail";
import MarkdownRenderer from "@/components/markdown-renderer";

const GITHUB_USER = "khadonnn";

async function fetchRepo(slug: string) {
    const res = await fetch(
        `https://api.github.com/repos/${GITHUB_USER}/${slug}`,
        {
            headers: { Accept: "application/vnd.github.mercy-preview+json" },
            next: { revalidate: 3600 },
        },
    );
    if (!res.ok) return null;
    return res.json();
}

async function fetchReadmeRaw(slug: string) {
    const res = await fetch(
        `https://api.github.com/repos/${GITHUB_USER}/${slug}/readme`,
        {
            headers: { Accept: "application/vnd.github.v3.raw" },
            next: { revalidate: 3600 },
        },
    );
    if (!res.ok) return null;
    return res.text();
}

function parseTechStack(readme: string | null) {
    if (!readme) return [] as string[];
    const m = readme.match(/^[ \t]*Tech(?: |-)stack\s*:\s*(.+)$/im);
    if (!m) return [] as string[];
    const raw = m[1].trim();
    // split by + , / or commas
    const parts = raw
        .split(/\s*(?:\+|,|\/)\s*/)
        .map((s) => s.trim())
        .filter(Boolean);
    return parts;
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const repo: any = await fetchRepo(slug);
    if (!repo) {
        return (
            <div className='py-16 max-w-3xl mx-auto px-4'>
                <h1 className='text-2xl font-semibold'>Project not found</h1>
                <p className='mt-2 text-muted-foreground'>
                    Can't find the requested repository.
                </p>
            </div>
        );
    }

    const defaultBranch = repo.default_branch || "main";
    const readme = await fetchReadmeRaw(slug);

    const techStack = parseTechStack(readme);

    const combinedTags = Array.from(
        new Set(
            [
                ...(repo.topics || []),
                ...(techStack || []),
                ...(repo.language ? [repo.language] : []),
            ].filter(Boolean),
        ),
    );

    const content = readme ? (
        <div className='prose prose-invert prose-zinc max-w-none mt-8'>
            <MarkdownRenderer
                repoSlug={slug}
                defaultBranch={defaultBranch}
                githubUser={GITHUB_USER}
            >
                {readme}
            </MarkdownRenderer>
        </div>
    ) : undefined;

    const project: DetailProject = {
        title: repo.name,
        description: repo.description ?? undefined,
        tags: combinedTags as readonly string[],
        imageUrl: repo.owner?.avatar_url,
        url: repo.html_url,
        github: repo.html_url,
        liveUrl: repo.homepage || undefined,
        status: repo.archived ? "Completed" : undefined,
        content,
        role: undefined,
    };

    return <ProjectDetail project={project} />;
}
