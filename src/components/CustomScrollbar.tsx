import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

const CustomScrollbar = () => {
    const { scrollYProgress } = useScroll();
    const [isHovered, setIsHovered] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    // Smooth out the scroll progress slightly for the visual thumb
    const smoothProgress = useSpring(scrollYProgress, {
        damping: 50,
        stiffness: 400
    });

    // Calculate top offset for the thumb based on the scroll progress.
    // We use string percentages so we don't need to know the window height.
    const thumbTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setIsScrolling(false);
            }, 1000); // hide scrollbar after 1s of inactivity unless hovered
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div
            className="fixed right-0 top-0 bottom-0 w-4 z-[999999] flex justify-center py-2 group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Scrollbar Track (invisible by default, shows on hover or scroll) */}
            <div
                className={`absolute right-1 w-[6px] h-full bg-[#120d2d]/80 rounded-full transition-all duration-300 ${isHovered || isScrolling ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Scrollbar Thumb */}
            <motion.div
                className={`fixed right-1 w-[6px] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-colors duration-300 ${isHovered ? 'bg-[#818cf8] w-[8px] right-[3px]' : 'bg-[#6366f1]'
                    } ${isHovered || isScrolling ? 'opacity-100' : 'opacity-30'}`}
                style={{
                    top: useTransform(smoothProgress, [0, 1], ["2%", "83%"]), // keeps padding from top and bottom
                    height: '15vh', // fixed height visual for the thumb
                }}
            />
        </div>
    );
};

export default CustomScrollbar;
