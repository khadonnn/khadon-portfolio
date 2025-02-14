"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { certificates } from "@/lib/data";

export default function CertificateDetail({
    params,
}: {
    params: { slug: string };
}) {
    const router = useRouter();
    const certificate = certificates.find((cert) => cert.slug === params.slug);

    if (!certificate) {
        return <p className='text-white text-lg'>Certificate not found</p>;
    }

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-lg z-[999]'>
            <div className='relative w-full h-full max-w-4xl mx-auto p-6'>
                <button
                    className='absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg text-black text-lg hover:bg-gray-200'
                    onClick={() => router.push("/")}
                >
                    ❌
                </button>
                <Image
                    src={certificate.imageSrc}
                    height={1000}
                    width={1000}
                    className='max-w-full max-h-[85vh] rounded-lg shadow-lg object-contain'
                    alt={certificate.title}
                />
            </div>
        </div>
    );
}
