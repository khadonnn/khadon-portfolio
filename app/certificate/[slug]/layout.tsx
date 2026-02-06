export default function CertificateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen bg-gray-950 -mt-28 sm:-mt-36 pt-0'>
            {children}
        </div>
    );
}
