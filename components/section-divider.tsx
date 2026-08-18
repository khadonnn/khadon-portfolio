"use client";

import React from "react";
import { motion } from "framer-motion";

export default function SectionDivider() {
    return (
        <motion.div
            className='bg-gray-200 my-12 h-1 w-24 rounded-full hidden sm:block dark:bg-opacity-20'
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.125 }}
        />
    );
}
