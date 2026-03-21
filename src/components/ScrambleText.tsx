import { useState, useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

interface ScrambleTextProps {
    text: string;
    duration?: number;
    revealDelay?: number;
    className?: string;
    chars?: string;
    scrambleFps?: number;
}

export const ScrambleText = ({
    text,
    duration = 2.5,
    revealDelay = 0.5,
    className = "",
    chars = CHARS,
    scrambleFps = 30
}: ScrambleTextProps) => {
    const [displayText, setDisplayText] = useState(() => {
        return text.replace(/[^\s\n]/g, () => chars[Math.floor(Math.random() * chars.length)]);
    });

    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let timeout: ReturnType<typeof setTimeout>;
        let animationFrame: ReturnType<typeof requestAnimationFrame>;
        let startTime: number | null = null;
        let lastFrameTime = 0;
        let isStarted = false;
        const frameInterval = 1000 / scrambleFps; // Controls how fast the characters change

        if (revealDelay > 0) {
            timeout = setTimeout(() => {
                isStarted = true;
            }, revealDelay * 1000);
        } else {
            isStarted = true;
        }

        const animate = (timestamp: number) => {
            // Throttle the visual updates to stop frantic flickering
            if (timestamp - lastFrameTime >= frameInterval) {
                lastFrameTime = timestamp;

                if (!isStarted) {
                    setDisplayText(text.replace(/[^\s\n]/g, () => chars[Math.floor(Math.random() * chars.length)]));
                    animationFrame = requestAnimationFrame(animate);
                    return;
                }

                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

                const revealIndex = Math.floor(progress * text.length);

                let newText = "";
                for (let i = 0; i < text.length; i++) {
                    if (text[i] === " " || text[i] === "\n") {
                        newText += text[i];
                    } else if (i < revealIndex) {
                        newText += text[i];
                    } else {
                        newText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }

                setDisplayText(newText);

                if (progress >= 1) {
                    setDisplayText(text);
                    return; // Stop animating
                }
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(animationFrame);
        };
    }, [text, duration, revealDelay, isInView, chars, scrambleFps]);

    // We use a structural hack: the REAL text is rendered invisible to lock the layout height.
    // The SCRAMBLED text is absolutely positioned over it so it cannot cause the layout to shake!
    return (
        <span ref={ref} className={`relative block w-full ${className}`}>
            <span className="invisible opacity-0 select-none pointer-events-none" aria-hidden="true" style={{ display: 'block', width: '100%' }}>
                {text}
            </span>
            <span className="absolute top-0 left-0 w-full h-full text-left">
                {displayText}
            </span>
        </span>
    );
};
