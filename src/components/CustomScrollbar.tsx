import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLenis } from 'lenis/react';

const CustomScrollbar = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const isDragging = useRef(false);
    const dragStartY = useRef(0);
    const dragStartScroll = useRef(0);
    const visibilityTimer = useRef<ReturnType<typeof setTimeout>>();

    // ── Write thumb position directly to DOM (no React re-render) ───────────
    const updateThumbDOM = useCallback((scroll: number, limit: number) => {
        if (!thumbRef.current) return;

        // Handle initial load where limit might be 0
        const actualLimit = limit > 0 ? limit : Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

        const clientHeight = window.innerHeight;
        const scrollHeight = actualLimit + clientHeight;

        const heightPct = Math.max(5, Math.min(50, (clientHeight / scrollHeight) * 100));
        const topPct = actualLimit > 0 ? (scroll / actualLimit) * (100 - heightPct) : 0;

        thumbRef.current.style.top = `${topPct}%`;
        thumbRef.current.style.height = `${heightPct}%`;
    }, []);

    // ── Show/hide scrollbar ──────────────────────────────────────────────────
    const bumpVisibility = useCallback(() => {
        setIsVisible(true);
        clearTimeout(visibilityTimer.current);
        visibilityTimer.current = setTimeout(() => {
            if (!isDragging.current) setIsVisible(false);
        }, 1200);
    }, []);

    // ── Bind to Lenis Scroll Loop ────────────────────────────
    const lenis = useLenis((lenisInstance) => {
        if (!isDragging.current) {
            updateThumbDOM(lenisInstance.scroll, lenisInstance.limit);
        }
        bumpVisibility();
    });

    // Fallback sync for window resize bounds
    useEffect(() => {
        const handleResize = () => {
            if (lenis) updateThumbDOM(lenis.scroll, lenis.limit);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [lenis, updateThumbDOM]);

    // ── Drag listeners ─────────────────────
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !lenis) return;
            if (!trackRef.current || !thumbRef.current) return;

            const track = trackRef.current.getBoundingClientRect();
            const deltaY = e.clientY - dragStartY.current;
            const limit = lenis.limit > 0 ? lenis.limit : Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

            // Pixels of scroll per pixel of track movement
            const scrollPerPx = limit / track.height;
            const newScroll = Math.max(0, Math.min(limit, dragStartScroll.current + deltaY * scrollPerPx));

            // Tell Lenis to jump instantly to the new scroll position!
            lenis.scrollTo(newScroll, { immediate: true });

            // Also instantly update the thumb visually
            updateThumbDOM(newScroll, limit);
        };

        const onMouseUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            setIsVisible(false);
            bumpVisibility();
            if (lenis) updateThumbDOM(lenis.scroll, lenis.limit);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [lenis, updateThumbDOM, bumpVisibility]);

    // ── Thumb mousedown: initiate drag ───────────────────────────────────────
    const onThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!lenis) return;

        isDragging.current = true;
        dragStartY.current = e.clientY;
        dragStartScroll.current = lenis.scroll;
        setIsVisible(true);

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    };

    // ── Track click: jump to position ────────────────────────────────────────
    const onTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (thumbRef.current?.contains(e.target as Node)) return;
        if (!trackRef.current || !lenis) return;

        const track = trackRef.current.getBoundingClientRect();
        const fraction = (e.clientY - track.top) / track.height;
        const limit = lenis.limit > 0 ? lenis.limit : Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

        // Let Lenis smoothly scroll to clicked fraction
        lenis.scrollTo(fraction * limit, { lerp: 0.1 });
    };

    const show = isVisible || isHovered;

    return (
        <div
            ref={trackRef}
            style={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                width: '14px',
                zIndex: 999999,
                cursor: 'pointer',
                userSelect: 'none',
            }}
            onMouseEnter={() => { setIsHovered(true); setIsVisible(true); }}
            onMouseLeave={() => { setIsHovered(false); }}
            onClick={onTrackClick}
        >
            {/* Track background */}
            <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: '4px',
                width: '6px',
                borderRadius: '9999px',
                background: 'rgba(18, 13, 45, 0.85)',
                opacity: show ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }} />

            {/* Thumb */}
            <div
                ref={thumbRef}
                onMouseDown={onThumbMouseDown}
                style={{
                    position: 'absolute',
                    right: isHovered ? '2px' : '4px',
                    top: '0%',
                    height: '15%',
                    width: isHovered ? '8px' : '6px',
                    borderRadius: '9999px',
                    background: isHovered
                        ? 'linear-gradient(180deg, #818cf8, #6366f1)'
                        : '#6366f1',
                    boxShadow: isHovered
                        ? '0 0 12px rgba(99,102,241,0.7)'
                        : '0 0 6px rgba(99,102,241,0.4)',
                    opacity: show ? 1 : 0.2,
                    cursor: 'grab',
                    userSelect: 'none',
                    willChange: 'top',
                    transition: 'width 0.15s ease, right 0.15s ease, opacity 0.3s ease, background 0.15s ease',
                }}
            />
        </div>
    );
};

export default CustomScrollbar;
