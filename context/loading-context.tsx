"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type LoadingContextType = {
    isReady: boolean;
    loadProgress: number;
    loadError: boolean;
    setIsReady: (value: boolean) => void;
    setLoadProgress: (value: number) => void;
    setLoadError: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [loadError, setLoadError] = useState(false);

    return (
        <LoadingContext.Provider
            value={{
                isReady,
                loadProgress,
                loadError,
                setIsReady,
                setLoadProgress,
                setLoadError,
            }}
        >
            {/* Hide all content when loading */}
            <div style={{ visibility: isReady ? 'visible' : 'hidden' }}>
                {children}
            </div>

            {/* GLOBAL LOADING SCREEN */}
            {!isReady && (
                <div className='fixed inset-0 z-[99999] flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-opacity duration-700'>
                    <div className='flex flex-col items-center gap-6 p-8'>
                        <div className='relative w-20 h-20'>
                            <div className='absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700'></div>
                            <div className='absolute inset-0 rounded-full border-4 border-t-pink-500 animate-spin'></div>
                        </div>

                        <div className='text-center'>
                            <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
                                {loadError ? "Ready!" : "Loading..."}
                            </h3>
                            <div className='w-64 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-4'>
                                <div
                                    className='h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300'
                                    style={{ width: `${loadProgress}%` }}
                                ></div>
                            </div>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                                {loadProgress}%
                            </p>
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
        throw new Error("useLoading must be used within LoadingProvider");
    }
    return context;
}
