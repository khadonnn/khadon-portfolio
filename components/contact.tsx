"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import { sendEmail } from "@/actions/sendEmail";
import SubmitBtn from "./submit-btn";
import toast from "react-hot-toast";

export default function Contact() {
    const { ref } = useSectionInView("Contact");

    return (
        <motion.section
            id='contact'
            ref={ref}
            className='mb-20 sm:mb-28 w-[min(100%,38rem)] text-center '
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
            <SectionHeading>Contact me</SectionHeading>

            <p className='text-gray-700 -mt-6 dark:text-white/80'>
                Please contact me directly at{" "}
                <a className='underline' href='mailto:example@gmail.com'>
                    nguyendinhdongkha@gmail.com
                </a>{" "}
                or through this form.
            </p>

            <form
                className='mt-10 flex flex-col dark:text-black'
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
                    className='h-14 shadow-sm px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none'
                    name='senderEmail'
                    type='email'
                    required
                    maxLength={500}
                    placeholder='Your email @gmail.com'
                />
                <textarea
                    className='h-52 shadow-md my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none'
                    name='message'
                    placeholder='Your message'
                    required
                    maxLength={5000}
                />
                <SubmitBtn />
            </form>
            <div className='bg-[#f5e0e0] absolute bottom-[6rem] -z-10 right-[11rem] h-[10.25rem] w-[10.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#bb5d83]'></div>
            <div className='bg-[#f4e2fa] absolute bottom-[1rem] -z-10 left-[-35rem] h-[10.25rem] w-[10rem] rounded-full blur-[10rem] sm:w-[60.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#6a4196]'></div>
        </motion.section>
    );
}
