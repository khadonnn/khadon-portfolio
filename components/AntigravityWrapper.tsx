"use client"; // File này chạy ở client để check window

import React, { useState, useEffect } from "react";
import Antigravity from "@/components/Antigravity"; // Import component gốc của bạn

type ParticleShape = "box" | "capsule";

export default function AntigravityWrapper() {
    // Mặc định là Desktop (để server render trước cái đẹp nhất hoặc nhẹ nhất tùy bạn)
    // Lời khuyên: Để mặc định mobile (nhẹ) để tránh lag lúc đầu, sau đó load nặng sau nếu là PC
    const [config, setConfig] = useState<{
        count: number;
        shape: ParticleShape;
    }>({
        count: 100, // Mặc định thấp cho an toàn
        shape: "box", // Ép kiểu string thành union type
    });

    useEffect(() => {
        // Chỉ chạy trên trình duyệt
        const isMobile = window.innerWidth < 768;

        setConfig({
            count: isMobile ? 120 : 500, // Mobile 120, Desktop 500
            shape: isMobile ? "box" : "capsule", // Mobile dùng hộp, Desktop dùng viên thuốc
        });
    }, []);

    return (
        <Antigravity
            count={config.count}
            particleShape={config.shape}
            // Các thông số chung giữ nguyên
            magnetRadius={10}
            ringRadius={6}
            waveSpeed={1.5}
            waveAmplitude={1}
            particleSize={0.6}
            lerpSpeed={0.05}
            color='#80ffff'
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={0.7}
            pulseSpeed={3}
            fieldStrength={10}
        />
    );
}
