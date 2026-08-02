"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useRef,
} from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import SplitType from "split-type";

type LoadingContextType = {
    isReady: boolean;
    isContentVisible: boolean;
    loadProgress: number;
    loadError: boolean;
    setIsReady: (value: boolean) => void;
    setLoadProgress: (value: number | ((prev: number) => number)) => void;
    setLoadError: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

interface LoadingProviderProps {
    children: ReactNode;
    videoSrc?: string;
}

export function LoadingProvider({ children, videoSrc }: LoadingProviderProps) {
    const [isReady, setIsReady] = useState(false);
    const [loadProgressValue, setLoadProgressValue] = useState(0);
    const [loadError, setLoadError] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);
    const [windowLoaded, setWindowLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hasCompletedLoad = useRef(false);
    const isProgressLocked = useRef(false);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();
    const isCertificatePage = pathname?.startsWith("/certificate/");

    const setLoadProgress = (value: number | ((prev: number) => number)) => {
        setLoadProgressValue((prev) => {
            const next = typeof value === "function" ? value(prev) : value;

            if (isProgressLocked.current && next < 100) {
                return prev;
            }

            const nextValue = Math.min(100, Math.max(prev, next));

            if (nextValue >= 100) {
                isProgressLocked.current = true;
            }

            return nextValue;
        });
    };

    useEffect(() => {
        if (isCertificatePage) {
            setIsReady(true);
            setIsUnmounted(true);
        }
    }, [isCertificatePage]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleWindowLoad = () => {
            setWindowLoaded(true);
        };

        if (document.readyState === "complete") {
            setWindowLoaded(true);
            return;
        }

        window.addEventListener("load", handleWindowLoad, { once: true });

        return () => {
            window.removeEventListener("load", handleWindowLoad);
        };
    }, []);

    useEffect(() => {
        if (!windowLoaded) return;

        if (document.fonts?.ready) {
            document.fonts.ready
                .then(() => {
                    setWindowLoaded(true);
                })
                .catch(() => {
                    setWindowLoaded(true);
                });
        }
    }, [windowLoaded]);

    // ====================== TIẾN TRÌNH THÔNG MINH (CHỐNG GIẬT LÙI) ======================
    useEffect(() => {
        if (!videoSrc || isCertificatePage) {
            if (!isCertificatePage && windowLoaded) setIsReady(true);
            return;
        }
        if (hasCompletedLoad.current) return; // Ngăn chặn việc load lại video khi component re-render

        setLoadProgress(0);

        const video = document.createElement("video") as HTMLVideoElement;
        videoRef.current = video;
        video.preload = "auto";
        video.muted = true;
        video.playsInline = true;

        let currentProgress = 0;

        progressIntervalRef.current = setInterval(() => {
            currentProgress = Math.min(currentProgress + 4, 95);
            setLoadProgress(currentProgress);
        }, 60);

        const finishLoading = () => {
            if (hasCompletedLoad.current) return;

            hasCompletedLoad.current = true;

            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
                progressIntervalRef.current = null;
            }

            if (finishTimeoutRef.current) {
                clearTimeout(finishTimeoutRef.current);
                finishTimeoutRef.current = null;
            }

            setLoadProgress(100);
            setIsReady(true);
        };

        finishTimeoutRef.current = setTimeout(() => {
            if (windowLoaded) {
                finishLoading();
            }
        }, 1200);

        const handleVideoError = () => {
            console.warn("Video load lỗi → Cho qua Loading luôn");
            setLoadError(true);
            finishLoading();
        };

        video.addEventListener("error", handleVideoError);

        video.src = videoSrc;
        video.load();

        if (windowLoaded) {
            finishLoading();
        }

        return () => {
            if (progressIntervalRef.current)
                clearInterval(progressIntervalRef.current);
            if (finishTimeoutRef.current)
                clearTimeout(finishTimeoutRef.current);
            video.removeEventListener("error", handleVideoError);
        };
    }, [videoSrc, isCertificatePage, windowLoaded]);

    // ====================== GSAP ANIMATION ======================
    useEffect(() => {
        if (!isReady || isCertificatePage) return;

        const loadingScreen = document.querySelector(
            ".global-loading-screen",
        ) as HTMLElement;
        if (!loadingScreen) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsUnmounted(true);
                },
            });

            tl.to([".loading-spinner", ".progress-container"], {
                opacity: 0,
                scale: 0.85,
                y: -30,
                duration: 0.6,
                ease: "power2.out",
            });

            const loadingText = document.querySelector(
                ".loading-text-container",
            ) as HTMLElement;
            if (loadingText) {
                const split = new SplitType(loadingText, { types: "chars" });
                if (split.chars) {
                    tl.fromTo(
                        split.chars,
                        { y: 0, opacity: 1, filter: "blur(0px)" },
                        {
                            y: (i) => (i < split.chars!.length / 2 ? -70 : 70),
                            opacity: 0,
                            filter: "blur(10px)",
                            stagger: 0.03,
                            duration: 0.8,
                            ease: "expo.inOut",
                        },
                        "-=0.3",
                    );
                    tl.to(
                        split.chars,
                        {
                            x: (i) =>
                                i < split.chars!.length / 2 ? -200 : 200,
                            scale: 0.5,
                            opacity: 0,
                            duration: 0.7,
                            stagger: 0.02,
                            ease: "power3.in",
                        },
                        "-=0.4",
                    );
                }
            }

            tl.to(
                loadingScreen,
                { opacity: 0, scale: 0.98, duration: 0.9, ease: "power3.out" },
                "-=0.5",
            );
        });

        return () => ctx.revert();
    }, [isReady, isCertificatePage]);

    return (
        <LoadingContext.Provider
            value={{
                isReady,
                isContentVisible: isCertificatePage || isUnmounted,
                loadProgress: loadProgressValue,
                loadError,
                setIsReady,
                setLoadProgress,
                setLoadError,
            }}
        >
            {/* Lớp bọc an toàn */}
            <div
                className={`main-content-wrapper w-full min-h-screen relative z-10 ${
                    isCertificatePage || isUnmounted
                        ? "opacity-100"
                        : "pointer-events-none"
                }`}
            >
                {children}
            </div>

            {/* Màn hình Loading */}
            {!isUnmounted && (
                <div className='global-loading-screen fixed inset-0 z-[99999] flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-700'>
                    <div className='flex flex-col items-center gap-10'>
                        <div className='loading-spinner relative w-20 h-20'>
                            <div className='absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700' />
                            <div className='absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin' />
                        </div>
                        <div className='progress-container w-64'>
                            <div className='h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                                <div
                                    className='h-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 transition-all duration-100'
                                    style={{
                                        width: `${Math.min(loadProgressValue, 100)}%`,
                                    }}
                                />
                            </div>
                            <p className='text-center text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono'>
                                {Math.min(loadProgressValue, 100)}%
                            </p>
                        </div>
                        <div className='loading-text-container text-center'>
                            <h3
                                className={`relative inline-block text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-[-2px] uppercase ${
                                    !loadError
                                        ? "after:content-['...'] after:absolute after:left-full after:top-0 after:ml-1"
                                        : ""
                                }`}
                            >
                                {loadError ? "Ready!" : "Loading..."}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}
