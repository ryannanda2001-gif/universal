'use client';

import { useEffect, useRef, useState } from 'react';

type RevealOnScrollProps = {
  children: React.ReactNode;
  className?: string;
  delayClassName?: string;
};

export function RevealOnScroll({ children, className = '', delayClassName = '' }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (!wasVisibleRef.current) {
            setAnimationKey((prev) => prev + 1);
            wasVisibleRef.current = true;
          }
        } else {
          setIsVisible(false);
          wasVisibleRef.current = false;
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        isVisible ? `translate-y-0 scale-100 blur-0 opacity-100 ${delayClassName}` : 'translate-y-12 scale-[0.96] blur-[6px] opacity-0'
      }`}
    >
      <div key={animationKey}>
        {children}
      </div>
    </div>
  );
}
