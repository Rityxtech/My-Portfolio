import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
}

export default function PullToRefresh({ children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isAtTop = useRef(true);

  const MAX_PULL = 120;
  const THRESHOLD = 80;

  useEffect(() => {
    const handleScroll = () => {
      isAtTop.current = window.scrollY <= 0;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isAtTop.current && !isRefreshing) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTop.current || isRefreshing || startY.current === 0) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        // Prevent default scrolling when pulling down
        if (e.cancelable) {
          e.preventDefault();
        }
        // Add resistance
        const resistance = distance * 0.4;
        setPullDistance(Math.min(resistance, MAX_PULL));
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance >= THRESHOLD && !isRefreshing) {
        setIsRefreshing(true);
        // Trigger refresh
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1s delay to show animation
      } else {
        // Reset if threshold not met
        setPullDistance(0);
      }
      startY.current = 0;
      currentY.current = 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    // Need passive: false to prevent default scroll behavior
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Pull to refresh indicator */}
      <div 
        className="fixed top-0 left-0 w-full flex justify-center z-[40] pointer-events-none"
        style={{ 
          transform: `translateY(${isRefreshing ? THRESHOLD : pullDistance}px)`,
          opacity: pullDistance > 0 || isRefreshing ? Math.min((pullDistance || THRESHOLD) / THRESHOLD, 1) : 0,
          transition: pullDistance === 0 || isRefreshing ? 'transform 0.3s ease-out, opacity 0.3s ease-out' : 'none'
        }}
      >
        <div className="bg-brand-indigo/90 backdrop-blur-md rounded-full p-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-brand-accent/50 flex items-center justify-center gap-2 mt-2">
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : (pullDistance / THRESHOLD) * 180 }}
            transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }}
          >
            <RefreshCw className="w-5 h-5 text-brand-accent" />
          </motion.div>
          {isRefreshing && <span className="text-sm font-bold text-white pr-2">Refreshing...</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
