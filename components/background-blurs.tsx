"use client";

import { usePathname } from "next/navigation";

export default function BackgroundBlurs() {
    const pathname = usePathname();

    // Ẩn background khi ở certificate page
    if (pathname?.startsWith("/certificate/")) {
        return null;
    }

    return (
        <>
            {/* <div className='bg-[#ffced0] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[40.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#ff8a8e]'></div>
            <div className='bg-[#e8bdf8] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[31rem] rounded-full blur-[10rem] sm:w-[60.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#dc93f6]'></div> */}
            {/* Blob Phải - Tông Đỏ/Hồng (Điểm cuối của gradient) */}
            {/* Blob Phải - Light: Hồng phấn | Dark: Đỏ đất mờ (nhìn thấy được) */}
            <div className='bg-[#fbe2e3] opacity-20 absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[40.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263] dark:opacity-10'></div>

            {/* Blob Trái - Light: Tím nhạt | Dark: Tím than mờ (nhìn thấy được) */}
            <div className='bg-[#dbd7fb] opacity-20 absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[31rem] rounded-full blur-[10rem] sm:w-[60.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394] dark:opacity-20'></div>
        </>
    );
}
