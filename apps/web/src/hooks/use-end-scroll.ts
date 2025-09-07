"use client";

import { useEffect, useRef, useState } from "react";

export function useEndScroll() {
  const endRef = useRef<HTMLDivElement | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!endRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setShowScrollButton(!entry.isIntersecting);
        console.log(entry.isIntersecting);
      },
      {
        root: scrollRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(endRef.current);

    return () => {
      if (endRef.current) observer.unobserve(endRef.current);
    };
  }, []);

  const scrollToBottom = () => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return { endRef, showScrollButton, scrollRef, scrollToBottom };
}
