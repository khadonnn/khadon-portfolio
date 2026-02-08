"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function BackgroundBlurs() {
    const pathname = usePathname();

    if (pathname?.startsWith("/certificate/")) {
        return null;
    }

    return (
        <>
            {/* Z-index: -z-[5] để nằm trên blobs nền nhưng dưới nội dung web */}
            <div className='fixed top-0 left-0 w-full h-full overflow-hidden -z-[5] pointer-events-none'>
                {/* Vệt nắng 1: VÀNG CAM ĐẬM (Chiếu từ trái) */}
                <motion.div
                    // from-yellow-500/40: Màu vàng đậm, độ trong suốt 40% (rất rõ)
                    // dark:from-blue-600/30: Màu xanh dương đậm cho chế độ tối
                    className='absolute top-[-10%] left-[-10%] h-[80vh] w-[20vw] bg-gradient-to-b from-pink-500/40 via-pink-300/10 to-transparent rounded-full blur-2xl dark:from-blue-600/30 dark:via-purple-900/10'
                    initial={{ rotate: 35, opacity: 0.5 }}
                    animate={{
                        opacity: [0.4, 0.7, 0.4], // Nhấp nháy mạnh hơn
                        rotate: [35, 30, 35], // Góc xoay
                        x: [0, 40, 0], // Di chuyển rộng hơn
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                />

                {/* Vệt nắng 2: VÀNG CHANH (Chiếu từ phải) */}
                <motion.div
                    className='absolute top-[-20%] right-[5%] h-[100vh] w-[25vw] bg-gradient-to-b from-slate-400/30 via-slate-100/5 to-transparent rounded-full blur-3xl dark:from-indigo-400/30 dark:via-transparent'
                    initial={{ rotate: -45, opacity: 0.5 }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [-45, -40, -45],
                        scaleX: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 9,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                />
            </div>
        </>
    );
}
