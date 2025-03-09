import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
// import chat_app from "@/public/chat_app.png";
// import order_food from "@/public/order_food.png";
import pern_store from "@/public/pern_store.png";
import kblog from "@/public/kblog.png";
import store_shop from "@/public/store_shop.png";

export const links = [
    {
        name: "Home",
        hash: "#home",
    },
    {
        name: "About",
        hash: "#about",
    },
    {
        name: "Certificate",
        hash: "#certificate",
    },
    {
        name: "Projects",
        hash: "#projects",
    },
    {
        name: "Skills",
        hash: "#skills",
    },
    {
        name: "Experience",
        hash: "#experience",
    },
    {
        name: "Contact",
        hash: "#contact",
    },
] as const;

export const experiencesData = [
    {
        title: "Business Administration ",
        location: "TDTU-University",
        description:
            "I graduated after 4 years of studying. I have a bachelor's degree in Business Administration.  ",
        icon: React.createElement(LuGraduationCap),
        score: "GPA: 7.1/10",
        date: "2018 - 2023",
    },
    {
        title: "Front-End Developer",
        location: "University of Science - VNUHCM",
        description:
            "I graduated after 4 months of studying. I have enhanced my skills in JavaScript, Bootstrap, Node.js, Cloudinary and MongoDB.",
        icon: React.createElement(CgWorkAlt),
        score: "GPA: 8.5/10",
        date: "02/2024-06/2024",
    },
    {
        title: "Full-Stack Developer",
        location: "UIT-CITD-University of Information Technology",
        description:
            "Studying for a second degree in web technology. My stack includes React, Next.js, TypeScript, Tailwind, Cloudinary and MongoDB.",
        icon: React.createElement(FaReact),
        score: "",
        date: "08/2024 - present",
    },
] as const;

export const certificates = [
    {
        title: "VNUHCM - University of Science ",
        description:
            "JavaScript, Bootstrap, Node.js, Cloudinary and MongoDB. Score: 8.5/10 ",
        imageSrc: "/Certificate.jpg",
        slug: "JavaScript",
        altText: "thumbnail",
    },
    {
        title: "TDTU-University",
        description: "Business Administration GPA: 7.1/10",
        imageSrc: "/certificate2.jpg",
        slug: "TDTU",
        altText: "thumbnail2",
    },
    {
        title: "Coursera React",
        description: "Certification of React in Coursera",
        slug: "Coursera-React",
        imageSrc: "/courseraReact.jpg",
        altText: "courseraReact",
    },
    {
        title: "IELTS Certificate",
        description: "Certification of IELTS from IDP",
        slug: "IELTS-certificate",
        imageSrc: "/IELTS.jpg",
        altText: "IELTS",
    },
] as const;
export const projectsData = [
    {
        title: "Pern Store",
        description:
            "This is a basic project with features related to CRUD, RESTful API, and PostgreSQL.",
        tags: [
            "Node.js",
            "Express.js",
            "PostgreSQL",
            "MongoDB",
            "Tailwind",
            "Daisyui",
            "Arcjet",
        ],
        imageUrl: pern_store,
        url: "https://pern-store-fs5d.onrender.com/",
    },
    // {
    //     title: "Chit Chat",
    //     description:
    //         "This is a chat app offering real-time messaging, file sharing, and seamless communication for everyone.",
    //     tags: ["React", "Firebase", "Tailwind", "Antd"],
    //     imageUrl: chat_app,
    //     url: "https://chitchat-khadon.vercel.app/",
    // },
    {
        title: "Store Shop",
        description:
            "This website offers fashion products and furniture with convenient shopping features, high quality, and beauty designs.",
        tags: ["React", "Next.js", "Wix", "Tailwind", "Stripe", "Zustand"],
        imageUrl: store_shop,
        url: "https://nextjs-shop-ten-tawny.vercel.app/",
    },
    {
        title: "Blog App",
        description:
            "This is a blog app that allows user to write and admin can edit or delete blog posts.",
        tags: [
            "React",
            "Next.js",
            "Css",
            "Cloudinary",
            "MongoDB",
            "React-quill",
            "Next-auth",
            "SWR",
            "Prisma",
        ],
        imageUrl: kblog,
        url: "https://k-blog-theta.vercel.app/",
    },
] as const;

export const skillsData = [
    "HTML",
    "CSS",
    "Framer Motion",
    "Tailwind",
    "Antd",
    "MUI",
    "Shadcn/ui",
    "Bootstrap",
    "JavaScript",
    "React",
    "Nextjs",
    "TypeScript",
    "Nextjs",
    "Git",
    "MongoDB",
    "Firebase",
    "Wix",
    "Expressjs",
    "FastAPI",
    "Stripe",
] as const;
