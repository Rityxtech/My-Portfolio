import { useState, useEffect, useRef } from 'react';
import { useInView } from 'motion/react';

export interface TypewriterSegment {
    text: string;
    className?: string;
}

interface TypewriterTextProps {
    paragraphs: TypewriterSegment[][];
    speed?: number; // Characters per second. 40 is a good realistic fast typing speed.
    delay?: number;
    className?: string;
    viewportMargin?: string;
}

export const TypewriterText = ({ paragraphs, speed = 40, delay = 0, className = "", viewportMargin = "0px 0px -25% 0px" }: TypewriterTextProps) => {
    const [revealedChars, setRevealedChars] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    // Requires the element to cross 25% of the viewport height before intersecting
    const isInView = useInView(ref, { once: true, margin: viewportMargin as any });

    const totalLength = paragraphs.reduce((acc, p) => acc + p.reduce((a, s) => a + s.text.length, 0), 0);
    const isFinished = revealedChars >= totalLength;

    useEffect(() => {
        if (!isInView) return;

        let timeout: ReturnType<typeof setTimeout>;
        let interval: ReturnType<typeof setInterval>;

        timeout = setTimeout(() => {
            let current = 0;
            interval = setInterval(() => {
                // Humanized typing bursts: sometimes pauses slightly, sometimes types 2 chars rapidly
                const burst = Math.random() > 0.85 ? 0 : (Math.random() > 0.5 ? 2 : 1);
                current += burst;

                if (current >= totalLength) {
                    setRevealedChars(totalLength);
                    clearInterval(interval);
                } else {
                    setRevealedChars(current);
                }
            }, 1000 / speed);
        }, delay * 1000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [isInView, totalLength, speed, delay]);

    // We use a global index across all paragraphs and segments to know exactly what is revealed
    let globalIndex = 0;

    return (
        <div ref={ref} className={`relative ${className}`}>
            {/* Terminal Loader State that shows before typing begins */}
            {revealedChars === 0 && (
                <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none flex flex-col gap-1.5 md:gap-2 font-mono text-[10px] md:text-xs">
                    <div className="flex items-center gap-2 text-brand-accent">
                        <span className="inline-block w-2 h-2 bg-brand-accent rounded-full animate-[ping_1.5s_infinite]" />
                        <span className="animate-pulse tracking-[0.2em] uppercase font-bold">System Standby</span>
                    </div>
                    <p className="text-slate-500">
                        &gt; Awaiting intersection observer... <span className={isInView ? "text-emerald-400" : "text-amber-400 animate-pulse"}>[{isInView ? 'OK' : 'PENDING'}]</span>
                    </p>
                    {isInView && (
                        <p className="text-slate-500 line-clamp-1">
                            &gt; Handshake established. Decrypting profile... <span className="text-brand-glow animate-pulse">_</span>
                        </p>
                    )}
                </div>
            )}

            {paragraphs.map((p, pIdx) => {
                return (
                    <p key={pIdx}>
                        {p.map((seg, sIdx) => {
                            const segLength = seg.text.length;
                            const segStart = globalIndex;
                            const segEnd = globalIndex + segLength;
                            globalIndex += segLength;

                            if (revealedChars <= segStart) {
                                // Not revealed at all -> Render purely as structural invisible layout to prevent shaking!
                                return (
                                    <span key={sIdx} className={seg.className}>
                                        <span className="opacity-0">{seg.text}</span>
                                    </span>
                                );
                            }

                            if (revealedChars >= segEnd) {
                                // Fully revealed
                                return (
                                    <span key={sIdx} className={seg.className}>
                                        {seg.text}
                                        {/* If the cursor is exactly at the end of this segment but before the next, render it here */}
                                        {revealedChars === segEnd && !isFinished && (
                                            <span className="inline-block w-[3px] h-[1.1em] bg-brand-accent align-text-bottom ml-[2px] animate-pulse" />
                                        )}
                                    </span>
                                );
                            }

                            // Partially revealed
                            const toReveal = revealedChars - segStart;
                            return (
                                <span key={sIdx} className={seg.className}>
                                    {seg.text.substring(0, toReveal)}
                                    {/* The active typing cursor */}
                                    <span className="inline-block w-[3px] h-[1.1em] bg-brand-accent align-text-bottom ml-[2px] animate-pulse shadow-[0_0_8px_#6366f1]" />
                                    {/* The unrevealed segment portion stays invisible so the layout is rigidly locked */}
                                    <span className="opacity-0">{seg.text.substring(toReveal)}</span>
                                </span>
                            );
                        })}

                        {/* If finished, show cursor blinking forever at the very end of the last paragraph */}
                        {isFinished && pIdx === paragraphs.length - 1 && (
                            <span className="inline-block w-[3px] h-[1.1em] bg-brand-accent/60 align-text-bottom ml-[2px] animate-[pulse_1.5s_infinite] shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                        )}
                    </p>
                );
            })}
        </div>
    );
};
