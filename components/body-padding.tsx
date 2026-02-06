"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BodyPadding() {
    const pathname = usePathname();

    useEffect(() => {
        const isCertificatePage = pathname?.startsWith("/certificate/");
        const body = document.body;

        if (isCertificatePage) {
            body.classList.remove("pt-28", "sm:pt-36");
        } else {
            body.classList.add("pt-28", "sm:pt-36");
        }
    }, [pathname]);

    return null;
}
