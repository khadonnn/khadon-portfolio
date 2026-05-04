"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

type MarkdownRendererProps = {
    children: string;
    repoSlug: string;
    defaultBranch: string;
    githubUser: string;
};

export default function MarkdownRenderer({
    children,
    repoSlug,
    defaultBranch,
    githubUser,
}: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            components={{
                img: ({ src, alt }) => {
                    const resolvedSrc =
                        typeof src === "string" &&
                        !src.startsWith("http") &&
                        !src.startsWith("//")
                            ? `https://raw.githubusercontent.com/${githubUser}/${repoSlug}/${defaultBranch}/${src.replace(/^\.\//, "")}`
                            : src;

                    return <img src={resolvedSrc ?? ""} alt={alt ?? ""} />;
                },
            }}
        >
            {children}
        </ReactMarkdown>
    );
}
