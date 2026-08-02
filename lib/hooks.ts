import { useActiveSectionContext } from "@/context/active-section-context";
import { useLoading } from "@/context/loading-context";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { SectionName } from "./types";

export function useSectionInView(sectionName: SectionName, threshold = 0.5) {
    const { ref, inView } = useInView({
        threshold,
    });
    const { setActiveSection, timeOfLastClick } = useActiveSectionContext();
    const { isReady } = useLoading();

    useEffect(() => {
        if (!isReady) return;

        if (inView && Date.now() - timeOfLastClick > 1000) {
            setActiveSection(sectionName);
        }
    }, [inView, isReady, setActiveSection, timeOfLastClick, sectionName]);

    return {
        ref,
    };
}
