import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export const ParticleLoader = ({ onComplete }: { onComplete: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let isMounted = true;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // Make them move slowly and elegantly
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges perfectly
                if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
                ctx.fill();
            }
        }

        const particles: Particle[] = [];
        const particleCount = Math.min(window.innerWidth / 15, 80);

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            if (!isMounted) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => p.update());

            // Connect close particles with lines (the constellation effect)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        // The closer they are, the more opaque the line
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.3 * (1 - distance / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
                particles[i].draw();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Simulate initial setup/asset loading time (e.g., 3.5 seconds)
        // If the window load event hasn't fired yet, it will wait for that too
        const timer = setTimeout(() => {
            if (document.readyState === 'complete') {
                onComplete();
            } else {
                window.addEventListener('load', () => setTimeout(onComplete, 500));
            }
        }, 6500);

        return () => {
            isMounted = false;
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(10px)"
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12">
                {/* Premium Glitch/Glow Logo */}
                <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-brand-accent/20 rounded-full animate-pulse" />
                    <span className="relative text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                        RityX<span className="text-brand-accent">Tech</span>
                    </span>
                </div>

                <div className="flex flex-col items-center gap-3 w-48 md:w-64">
                    <div className="w-full h-[2px] bg-slate-800 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ width: "0%", left: "0%" }}
                            animate={{
                                width: ["0%", "50%", "100%", "100%"],
                                left: ["0%", "0%", "0%", "100%"]
                            }}
                            transition={{
                                duration: 6.5,
                                ease: "easeInOut",
                                times: [0, 0.5, 0.9, 1]
                            }}
                            className="absolute h-full bg-brand-accent shadow-[0_0_15px_#6366f1]"
                        />
                    </div>

                    <div className="flex justify-between w-full font-mono text-[9px] md:text-[10px] text-slate-500 tracking-[0.2em] uppercase">
                        <span>Booting</span>
                        <motion.span
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-brand-accent font-bold"
                        >
                            SYSTEM_READY
                        </motion.span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
