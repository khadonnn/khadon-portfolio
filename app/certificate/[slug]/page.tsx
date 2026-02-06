import { notFound } from "next/navigation";
import Image from "next/image";
import { certificates } from "@/lib/data";
import { BsArrowLeft } from "react-icons/bs";

interface PageProps {
    params: { slug: string };
}

export default function CertificateDetail({ params }: PageProps) {
    const certificate = certificates.find((c) => c.slug === params.slug);

    if (!certificate) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 transition-colors'>
            <div className='relative w-full max-w-5xl'>
                <a
                    href='/'
                    className='absolute top-0 left-0 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg text-gray-900 dark:text-white text-lg hover:bg-gray-100 dark:hover:bg-gray-700 z-10 flex items-center gap-2 transition-colors'
                >
                    <BsArrowLeft />
                    <span className='text-sm font-medium'>Back</span>
                </a>
                <div className='mt-12'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center'>
                        {certificate.title}
                    </h1>
                    <p className='text-gray-600 dark:text-gray-400 mb-6 text-center'>
                        {certificate.description}
                    </p>
                    {/* Dùng img tag thay vì Next Image để tránh optimization issue */}
                    <img
                        src={certificate.imageSrc}
                        className='w-full rounded-lg shadow-2xl object-contain'
                        alt={certificate.title}
                    />
                </div>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return certificates.map((cert) => ({
        slug: cert.slug,
    }));
}
