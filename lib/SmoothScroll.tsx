"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export let lenisInstance: Lenis | null = null;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        if (!isDesktop) return;

        const lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
        lenisRef.current = lenis;
        lenisInstance = lenis;

        document.documentElement.classList.add("lenis", "lenis-smooth");
        document.body.classList.add("lenis");

        let frameId = 0;

        const raf = (time: number) => {
            lenis.raf(time);
            frameId = window.requestAnimationFrame(raf);
        };

        frameId = window.requestAnimationFrame(raf);

        return () => {
            window.cancelAnimationFrame(frameId);
            lenis.destroy();
            lenisInstance = null;
            document.documentElement.classList.remove("lenis", "lenis-smooth");
            document.body.classList.remove("lenis");
        };
    }, []);

    return <>{children}</>;
}
