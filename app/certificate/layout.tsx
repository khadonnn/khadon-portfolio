"use client";

import { useEffect } from "react";

export default function CertificateRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Reset body overflow khi vào certificate page
    useEffect(() => {
        document.body.style.overflow = "auto";
    }, []);
    
    return (
        <div className='min-h-screen bg-gray-950'>
            {children}
        </div>
    );
}
