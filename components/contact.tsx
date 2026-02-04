"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-btn";
import toast from "react-hot-toast";
import { BackgroundBeams } from "./ui/background-beams";

export default function Contact() {
    const { ref } = useSectionInView("Contact");

    return (
        <motion.section
            id='contact'
            ref={ref}
            className='px-4 sm:px-6 mb-20 sm:mb-28 w-full text-center relative overflow-hidden flex justify-center items-center min-h-[35rem] sm:min-h-[40rem]'
            initial={{
                opacity: 0,
            }}
            whileInView={{
                opacity: 1,
            }}
            transition={{
                duration: 1,
            }}
            viewport={{
                once: true,
            }}
        >
            {/* Hiệu ứng background beams phủ full section */}
            <div className='absolute inset-0 -z-20 pointer-events-none'>
                <BackgroundBeams />
            </div>
            {/* Các background cũ vẫn giữ lại nếu muốn */}
            <div className='bg-[#f9d2d2] absolute bottom-[8rem] -z-10 right-[11rem] h-[10.25rem] w-[10.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#bb5d83aa]'></div>
            <div className='bg-[#d6aae4] absolute bottom-[8rem] -z-10 left-[-35rem] h-[10.25rem] w-[10rem] rounded-full blur-[10rem] sm:w-[60.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#794aabb1]'></div>

            {/* Nội dung form căn giữa trong container nhỏ */}
            <div className='w-full max-w-[38rem] mx-auto z-10'>
                <SectionHeading>Contact me</SectionHeading>

                <p className='text-gray-700 -mt-6 px-2 text-sm sm:text-base dark:text-white/80'>
                    Please contact me directly at{" "}
                    <a
                        className='underline break-all sm:break-normal'
                        href='mailto:example@gmail.com'
                    >
                        nguyendinhdongkha@gmail.com
                    </a>{" "}
                    or through this form.
                </p>

                <form
                    className='mt-6 sm:mt-10 flex flex-col dark:text-black'
                    action={async (formData) => {
                        const { data, error } = await sendEmail(formData);

                        if (error) {
                            toast.error(error, { duration: 3000 });
                            return;
                        }

                        toast.success("🤗 You have sent email Successfully!", {
                            duration: 3000,
                        });
                    }}
                >
                    <input
                        className='h-12 sm:h-14 text-sm sm:text-base shadow-sm px-3 sm:px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none'
                        name='senderEmail'
                        type='email'
                        required
                        maxLength={500}
                        placeholder='Your email @gmail.com'
                    />
                    <textarea
                        className='h-40 sm:h-52 text-sm sm:text-base shadow-md my-3 rounded-lg borderBlack p-3 sm:p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none resize-none'
                        name='message'
                        placeholder='Your message'
                        required
                        maxLength={5000}
                    />
                    <SubmitBtn />
                </form>
            </div>
        </motion.section>
    );
}
