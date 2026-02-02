"use client";

import { useEffect, useState, useRef } from "react";

interface AiCursorProps {
  targetElementId: string | null;
  isRunning: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export default function AiCursor({ targetElementId, isRunning, containerRef }: AiCursorProps) {
  const [position, setPosition] = useState({ x: -50, y: -50 });
  const [showRipple, setShowRipple] = useState(false);
  const rippleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!targetElementId || !isRunning || !containerRef.current) {
      setPosition({ x: -50, y: -50 });
      return;
    }

    const target = containerRef.current.querySelector(
      `[data-crm-id="${targetElementId}"]`
    );
    if (!target) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const x = targetRect.left - containerRect.left + targetRect.width / 2;
    const y = targetRect.top - containerRect.top + targetRect.height / 2;

    setPosition({ x, y });

    // Show ripple after cursor arrives
    if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    rippleTimeoutRef.current = setTimeout(() => {
      setShowRipple(true);
      setTimeout(() => setShowRipple(false), 400);
    }, 600);

    return () => {
      if (rippleTimeoutRef.current) clearTimeout(rippleTimeoutRef.current);
    };
  }, [targetElementId, isRunning, containerRef]);

  if (!isRunning) return null;

  return (
    <>
      {/* Cursor */}
      <div
        className="ai-cursor-pointer"
        style={{
          left: position.x - 4,
          top: position.y - 4,
        }}
      >
        {/* Arrow shape using CSS */}
        <div
          className="relative"
          style={{
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderBottom: "14px solid #E4002B",
            transform: "rotate(-30deg)",
            filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.3))",
          }}
        />
        {/* AI label */}
        <div
          className="absolute top-3 left-2 bg-[#E4002B] text-white text-[8px] font-bold px-1 py-0.5 rounded shadow"
          style={{ whiteSpace: "nowrap" }}
        >
          AI
        </div>
      </div>

      {/* Ripple */}
      {showRipple && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: position.x - 12,
            top: position.y - 12,
          }}
        >
          <div
            className="ai-cursor-ripple w-6 h-6 rounded-full border-2 border-[#E4002B]"
          />
        </div>
      )}
    </>
  );
}
