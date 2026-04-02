import { useRef, useEffect } from 'react';

export default function VideoBackground({ src, overlayColor = 'bg-warm/80', darkOverlayColor = 'dark:bg-slate-950/80', opacity = 0.6 }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75; // Slower, more cinematic
        }
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-110 blur-[1px]"
            >
                <source src={src} type="video/mp4" />
            </video>
            <div className={`absolute inset-0 ${overlayColor} ${darkOverlayColor} transition-colors duration-700`} style={{ opacity }} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-warm dark:to-slate-950" />
        </div>
    );
}
