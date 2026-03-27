import { useEffect, useState } from "react";

export function useIsDesktop(breakpoint: number = 768) {
    const [isDesktop, setIsDesktop] = useState<boolean>(false);

    useEffect(() => {
        setIsDesktop(window.innerWidth >= breakpoint);

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= breakpoint);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [breakpoint]);

    return isDesktop;
}
