"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useTheme } from "@/context/theme-context";

interface AntigravityProps {
    count?: number;
    magnetRadius?: number;
    ringRadius?: number;
    waveSpeed?: number;
    waveAmplitude?: number;
    particleSize?: number;
    lerpSpeed?: number;
    color?: string;
    autoAnimate?: boolean;
    particleVariance?: number;
    rotationSpeed?: number;
    depthFactor?: number;
    pulseSpeed?: number;
    particleShape?: "capsule" | "sphere" | "box" | "tetrahedron";
    fieldStrength?: number;
}

const AntigravityInner: React.FC<AntigravityProps> = ({
    count = 300,
    magnetRadius = 10,
    ringRadius = 10,
    waveSpeed = 0.4,
    waveAmplitude = 1,
    particleSize = 2,
    lerpSpeed = 0.1,
    color = "#FF9FFC",
    autoAnimate = false,
    particleVariance = 1,
    rotationSpeed = 0,
    depthFactor = 1,
    pulseSpeed = 3,
    particleShape = "capsule",
    fieldStrength = 10,
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { viewport, gl } = useThree();
    const { theme } = useTheme();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const lastMousePos = useRef({ x: 0, y: 0 });
    const lastMouseMoveTime = useRef(0);
    const virtualMouse = useRef({ x: 0, y: 0 });
    const externalPointer = useRef({ x: 0, y: 0 });
    const activeTarget = useRef({ x: 0, y: 0, active: false });
    const pointerInside = useRef(false);

    // Attach hover listeners to elements marked with `data-antigravity-target`
    useEffect(() => {
        const el = gl?.domElement as HTMLElement | undefined;
        if (!el) return;

        const elems = Array.from(
            document.querySelectorAll("[data-antigravity-target]"),
        ) as HTMLElement[];
        const handlers: Array<() => void> = [];

        elems.forEach((e) => {
            const onEnter = () => {
                const rect = el.getBoundingClientRect();
                const er = e.getBoundingClientRect();
                const centerX = er.left + er.width / 2;
                const centerY = er.top + er.height / 2;
                const nx = ((centerX - rect.left) / rect.width) * 2 - 1;
                const ny = -(((centerY - rect.top) / rect.height) * 2 - 1);
                activeTarget.current.x = nx;
                activeTarget.current.y = ny;
                activeTarget.current.active = true;
            };
            const onLeave = () => {
                activeTarget.current.active = false;
            };
            e.addEventListener("mouseenter", onEnter);
            e.addEventListener("mouseleave", onLeave);
            handlers.push(() => {
                e.removeEventListener("mouseenter", onEnter);
                e.removeEventListener("mouseleave", onLeave);
            });
        });

        return () => handlers.forEach((h) => h());
    }, [gl]);

    useEffect(() => {
        const el = gl?.domElement as HTMLElement | undefined;
        const handler = (e: MouseEvent) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const inside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;
            if (inside) {
                const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
                externalPointer.current.x = nx;
                externalPointer.current.y = ny;
                pointerInside.current = true;
                lastMouseMoveTime.current = Date.now();
            } else {
                // mouse left the canvas area: mark as outside so effect falls back to autoAnimate
                pointerInside.current = false;
                lastMouseMoveTime.current = 0;
            }
        };
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, [gl]);

    const particles = useMemo(() => {
        const temp = [];
        const width = viewport.width || 100;
        const height = viewport.height || 100;

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;

            const x = (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * height;
            const z = (Math.random() - 0.5) * 20;

            const randomRadiusOffset = (Math.random() - 0.5) * 2;

            temp.push({
                t,
                factor,
                speed,
                xFactor,
                yFactor,
                zFactor,
                mx: x,
                my: y,
                mz: z,
                cx: x,
                cy: y,
                cz: z,
                vx: 0,
                vy: 0,
                vz: 0,
                randomRadiusOffset,
                collected: false,
                collectedAt: 0,
            });
        }
        return temp;
    }, [count, viewport.width, viewport.height]);

    const materialColor = useMemo(() => {
        if (typeof window === "undefined") return color;
        // Use theme from ThemeContext: 'dark' keeps provided color, light uses black
        return theme === "dark" ? color : "#000000";
    }, [color, theme]);

    useFrame((state) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        const { viewport: v } = state;
        // use active target (hovered element) when active
        // otherwise use externalPointer only if pointer is inside the intro area
        let m = { x: 0, y: 0 } as { x: number; y: number };
        if (activeTarget.current.active) {
            m = activeTarget.current as { x: number; y: number };
        } else if (pointerInside.current) {
            m = externalPointer.current as { x: number; y: number };
        }

        let mouseDist = 0;
        if (activeTarget.current.active || pointerInside.current) {
            mouseDist = Math.sqrt(
                Math.pow(m.x - lastMousePos.current.x, 2) +
                    Math.pow(m.y - lastMousePos.current.y, 2),
            );

            if (mouseDist > 0.001) {
                lastMouseMoveTime.current = Date.now();
                lastMousePos.current = { x: m.x, y: m.y };
            }
        } else {
            // not inside; ensure lastMouseMoveTime is cleared so autoAnimate can run
            lastMouseMoveTime.current = 0;
        }

        let destX = (m.x * v.width) / 2;
        let destY = (m.y * v.height) / 2;

        if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
            const time = state.clock.getElapsedTime();
            destX = Math.sin(time * 0.5) * (v.width / 4);
            destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
        }

        const smoothFactor = 0.05;
        virtualMouse.current.x +=
            (destX - virtualMouse.current.x) * smoothFactor;
        virtualMouse.current.y +=
            (destY - virtualMouse.current.y) * smoothFactor;

        const targetX = virtualMouse.current.x;
        const targetY = virtualMouse.current.y;

        const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

        const localMagnet = activeTarget.current.active
            ? Math.max(magnetRadius, 120)
            : magnetRadius;

        const collectRadius = 10; // pixels in canvas space
        const respawnDelay = 1200; // ms

        particles.forEach((particle: any, i: number) => {
            let {
                t,
                speed,
                mx,
                my,
                mz,
                cz,
                randomRadiusOffset,
                collected,
                collectedAt,
            } = particle;

            t = particle.t += speed / 2;

            const projectionFactor = 1 - cz / 50;
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            const dx = mx - projectedTargetX;
            const dy = my - projectedTargetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetPos = { x: mx, y: my, z: mz * depthFactor };

            if (dist < localMagnet) {
                const angle = Math.atan2(dy, dx) + globalRotation;

                const wave =
                    Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
                const deviation =
                    randomRadiusOffset * (5 / (fieldStrength + 0.1));

                const currentRingRadius = ringRadius + wave + deviation;

                targetPos.x =
                    projectedTargetX + currentRingRadius * Math.cos(angle);
                targetPos.y =
                    projectedTargetY + currentRingRadius * Math.sin(angle);
                targetPos.z =
                    mz * depthFactor +
                    Math.sin(t) * (1 * waveAmplitude * depthFactor);
            }

            particle.cx += (targetPos.x - particle.cx) * lerpSpeed;
            particle.cy += (targetPos.y - particle.cy) * lerpSpeed;
            particle.cz += (targetPos.z - particle.cz) * lerpSpeed;

            dummy.position.set(particle.cx, particle.cy, particle.cz);

            dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
            dummy.rotateX(Math.PI / 2);

            const currentDistToMouse = Math.sqrt(
                Math.pow(particle.cx - projectedTargetX, 2) +
                    Math.pow(particle.cy - projectedTargetY, 2),
            );

            // If gathering to a hovered element, collect particles that reach close
            if (
                activeTarget.current.active &&
                !collected &&
                currentDistToMouse < collectRadius
            ) {
                particle.collected = true;
                particle.collectedAt = Date.now();
                // snap to center
                particle.cx = projectedTargetX;
                particle.cy = projectedTargetY;
                particle.cz = mz * depthFactor - 2; // move slightly forward
            }

            if (collected) {
                // after delay respawn particle to a random place
                if (Date.now() - collectedAt > respawnDelay) {
                    const width = v.width || 100;
                    const height = v.height || 100;
                    const nx = (Math.random() - 0.5) * width;
                    const ny = (Math.random() - 0.5) * height;
                    const nz = (Math.random() - 0.5) * 20;
                    particle.mx = nx;
                    particle.my = ny;
                    particle.mz = nz;
                    particle.cx = nx;
                    particle.cy = ny;
                    particle.cz = nz;
                    particle.collected = false;
                    particle.t = Math.random() * 100;
                } else {
                    // keep it small/hidden while collected
                    dummy.scale.set(0.01, 0.01, 0.01);
                    dummy.position.set(particle.cx, particle.cy, particle.cz);
                    dummy.updateMatrix();
                    mesh.setMatrixAt(i, dummy.matrix);
                    return; // skip rest of logic for collected particle
                }
            }

            const distFromRing = Math.abs(currentDistToMouse - ringRadius);
            let scaleFactor = 1 - distFromRing / 10;

            scaleFactor = Math.max(0, Math.min(1, scaleFactor));

            const finalScale =
                scaleFactor *
                (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) *
                particleSize;
            dummy.scale.set(finalScale, finalScale, finalScale);

            dummy.updateMatrix();

            mesh.setMatrixAt(i, dummy.matrix);
        });

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {particleShape === "capsule" && (
                <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
            )}
            {particleShape === "sphere" && (
                <sphereGeometry args={[0.2, 16, 16]} />
            )}
            {particleShape === "box" && <boxGeometry args={[0.3, 0.3, 0.3]} />}
            {particleShape === "tetrahedron" && (
                <tetrahedronGeometry args={[0.3]} />
            )}
            <meshBasicMaterial color={materialColor as unknown as any} />
        </instancedMesh>
    );
};

const Antigravity: React.FC<AntigravityProps> = (props) => {
    return (
        <Canvas
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 50], fov: 35 }}
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "high-performance" }}
        >
            <AntigravityInner {...props} />
        </Canvas>
    );
};

export default Antigravity;
