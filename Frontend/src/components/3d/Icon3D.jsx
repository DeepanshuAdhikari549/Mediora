import { useEffect, useRef } from 'react';

// Floating 3D icon with CSS 3D transforms and glow
export default function Icon3D({ icon: Icon, color = '#38bdf8', size = 48, label, onClick }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        let frame;
        let time = Math.random() * 100;

        const animate = () => {
            time += 0.02;
            const y = Math.sin(time) * 6;
            const rotX = Math.sin(time * 0.7) * 8;
            const rotY = Math.cos(time * 0.5) * 8;
            el.style.transform = `translateY(${y}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            frame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <button
            onClick={onClick}
            className="group flex flex-col items-center gap-3 cursor-pointer"
            style={{ perspective: '400px', perspectiveOrigin: 'center' }}
        >
            <div
                ref={containerRef}
                style={{
                    width: size,
                    height: size,
                    transformStyle: 'preserve-3d',
                    transition: 'filter 0.3s',
                }}
                className="group-hover:drop-shadow-[0_0_20px_rgba(56,189,248,0.8)] transition-all duration-300"
            >
                {/* 3D Box icon */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '22%',
                        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                        border: `1.5px solid ${color}55`,
                        boxShadow: `0 8px 32px ${color}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Shine effect */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
                            borderRadius: 'inherit',
                        }}
                    />
                    <Icon style={{ width: size * 0.5, height: size * 0.5, color }} />
                </div>
            </div>
            {label && (
                <span className="text-xs font-bold text-slate-300 group-hover:text-sky-300 transition-colors">
                    {label}
                </span>
            )}
        </button>
    );
}
