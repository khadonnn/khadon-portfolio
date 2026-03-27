// "use client";
// import React from "react";

// function GalaxyHero() {
//     return (
//         <div className='fixed inset-0 w-full h-full overflow-hidden z-[-1]'>
//             <video
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 src='/assets/video_bg/galaxy.mp4'
//                 // Dùng invert ở Light mode để lật ngược màu (Đen -> Trắng)
//                 className='absolute top-0 left-0 w-full h-full object-cover object-top invert dark:invert-0 transition-all duration-700'
//             />
//             {/* Lớp phủ siêu mỏng chỉ để làm dịu mắt */}
//             <div className='absolute inset-0 bg-white/10 dark:bg-black/40 transition-colors duration-700'></div>
//         </div>
//     );
// }

// export default GalaxyHero;
// "use client";
// import React from "react";
// // Đảm bảo bạn import đúng hook lấy theme đang dùng trong dự án
// import { useTheme } from "@/context/theme-context";

// function GalaxyHero() {
//     const { theme } = useTheme();

//     return (
//         <div className='fixed inset-0 w-full h-full overflow-hidden z-[-1]'>
//             {theme === "light" ? (
//                 <video
//                     key="light-video" // Thêm key để React mount lại video mới
//                     autoPlay loop muted playsInline
//                     src='/assets/video_bg/light-abstract-bg.mp4' // Video nền sáng
//                     className='absolute top-0 left-0 w-full h-full object-cover object-top opacity-80'
//                 />
//             ) : (
//                 <video
//                     key="dark-video"
//                     autoPlay loop muted playsInline
//                     src='/assets/video_bg/galaxy.mp4' // Video dải ngân hà đen
//                     className='absolute top-0 left-0 w-full h-full object-cover object-top'
//                 />
//             )}
//             {/* Lớp phủ đen cho Dark mode để dễ đọc chữ */}
//             <div className='absolute inset-0 dark:bg-black/40'></div>
//         </div>
//     );
// }

// export default GalaxyHero;
