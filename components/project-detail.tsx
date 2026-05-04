import React from "react";
import Link from "next/link";

// 1. Định nghĩa kiểu dữ liệu (Interface) cho Project
export interface Project {
    title: string;
    description: string;
    tags: readonly string[];
    imageUrl?: any;
    url?: string;
    // Các trường bổ sung từ giao diện Hugo
    status?: "Live" | "Completed" | "In Progress" | string;
    github?: string;
    liveUrl?: string;
    teamSize?: string;
    role?: string;
    duration?: string;
    platform?: string;
    content?: React.ReactNode; // Nội dung bài viết chi tiết (thay thế cho {{ .Content }})
}

interface ProjectDetailProps {
    project: Project;
}

// 2. Component hiển thị chi tiết
export default function ProjectDetail({ project }: ProjectDetailProps) {
    // Hàm xử lý màu sắc cho status
    const getStatusStyle = (status?: string) => {
        switch (status) {
            case "Live":
                return "bg-green-500/10 text-green-400 border-green-500/20";
            case "Completed":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "In Progress":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            default:
                return "bg-muted text-muted-foreground border-border/40";
        }
    };

    return (
        <div className='py-2 space-y-8 max-w-3xl reveal mx-auto'>
            {/* Nút Back */}
            <Link
                href='/projects'
                className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group'
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
                Back to Projects
            </Link>

            <header className='space-y-4'>
                {/* Tiêu đề & Trạng thái */}
                <div className='flex items-start justify-between gap-4 flex-wrap'>
                    <h1 className='text-3xl font-bold tracking-tight text-foreground'>
                        {project.title}
                    </h1>
                    {project.status && (
                        <span
                            className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 mt-1.5 ${getStatusStyle(
                                project.status,
                            )}`}
                        >
                            {project.status}
                        </span>
                    )}
                </div>

                {/* Mô tả */}
                <p className='text-muted-foreground leading-relaxed'>
                    {project.description}
                </p>

                {/* Tags */}
                <div className='flex flex-wrap gap-2 pt-1'>
                    {project.tags.map((tag, index) => (
                        <span
                            key={index}
                            className='inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border/40'
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Links (Github & Live Demo) */}
                {(project.github || project.liveUrl || project.url) && (
                    <div className='flex items-center gap-3 pt-2'>
                        {/* Nếu có link Github */}
                        {(project.github || project.url) && (
                            <a
                                href={project.github || project.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/link'
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
                                    className='w-4 h-4 group-hover/link:text-amber-400 transition-colors'
                                >
                                    <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
                                    <path d='M9 18c-4.51 2-5-2-7-2' />
                                </svg>
                                Source Code
                            </a>
                        )}

                        {/* Nếu có link Live Demo */}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/link'
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
                                    className='w-4 h-4 group-hover/link:text-amber-400 transition-colors'
                                >
                                    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
                                    <polyline points='15 3 21 3 21 9' />
                                    <line x1='10' y1='14' x2='21' y2='3' />
                                </svg>
                                Live Demo
                            </a>
                        )}
                    </div>
                )}
            </header>

            {/* Divider (thay thế cho partial "ui/divider.html") */}
            <hr className='border-border/40 my-8' />

            {/* Project Info Grid */}
            {(project.role ||
                project.teamSize ||
                project.duration ||
                project.platform) && (
                <section className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    {project.role && (
                        <div className='space-y-1 p-3 rounded-lg bg-card/40 border border-border/40'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                                My Role
                            </p>
                            <p className='text-sm font-medium text-foreground'>
                                {project.role}
                            </p>
                        </div>
                    )}
                    {project.teamSize && (
                        <div className='space-y-1 p-3 rounded-lg bg-card/40 border border-border/40'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                                Team Size
                            </p>
                            <p className='text-sm font-medium text-foreground'>
                                {project.teamSize}
                            </p>
                        </div>
                    )}
                    {project.duration && (
                        <div className='space-y-1 p-3 rounded-lg bg-card/40 border border-border/40'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                                Duration
                            </p>
                            <p className='text-sm font-medium text-foreground'>
                                {project.duration}
                            </p>
                        </div>
                    )}
                    {project.platform && (
                        <div className='space-y-1 p-3 rounded-lg bg-card/40 border border-border/40'>
                            <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                                Platform
                            </p>
                            <p className='text-sm font-medium text-foreground'>
                                {project.platform}
                            </p>
                        </div>
                    )}
                </section>
            )}

            {/* Content chính của bài viết (MDX hoặc string HTML tuỳ setup của bạn) */}
            {project.content && (
                <article className='prose prose-invert prose-zinc max-w-none mt-8'>
                    {project.content}
                </article>
            )}
        </div>
    );
}
