"use client";

import React from "react";
import { Tooltip } from "./tooltip-card";

export const ScrollAnimatedTooltip = ({
    content,
    children,
    containerClassName,
}: {
    content: string | React.ReactNode;
    children: React.ReactNode;
    containerClassName?: string;
}) => {
    return (
        <Tooltip content={content} containerClassName={containerClassName}>
            {children}
        </Tooltip>
    );
};
