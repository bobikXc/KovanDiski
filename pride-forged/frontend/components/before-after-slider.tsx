"use client";

import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

type BeforeAfterSliderProps = {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
};

const MIN_POSITION = 4;
const MAX_POSITION = 96;

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
}: BeforeAfterSliderProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;

    const bounds = frame.getBoundingClientRect();
    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(MAX_POSITION, Math.max(MIN_POSITION, nextPosition)));
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updatePosition(event.clientX);
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((current) => Math.max(MIN_POSITION, current - step));
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((current) => Math.min(MAX_POSITION, current + step));
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setPosition(event.key === "Home" ? MIN_POSITION : MAX_POSITION);
    }
  };

  return (
    <div className="visualizer-shell">
      <div
        ref={frameRef}
        className="visualizer-comparison"
        data-dragging={isDragging}
        onKeyDown={handleKeyDown}
        onPointerCancel={stopDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        role="slider"
        tabIndex={0}
        aria-label="Сравнение автомобиля до и после установки дисков PRIDE"
        aria-valuemin={MIN_POSITION}
        aria-valuemax={MAX_POSITION}
        aria-valuenow={Math.round(position)}
      >
        <Image
          src={beforeImage}
          alt={beforeAlt}
          fill
          sizes="(min-width: 1280px) 690px, (min-width: 1024px) 54vw, 92vw"
          className="visualizer-image visualizer-image-before"
        />

        <div
          className="visualizer-after-layer"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <Image
            src={afterImage}
            alt={afterAlt}
            fill
            sizes="(min-width: 1280px) 690px, (min-width: 1024px) 54vw, 92vw"
            className="visualizer-image visualizer-image-after"
          />
        </div>

        <div className="visualizer-vignette" aria-hidden="true" />

        <span className="visualizer-badge visualizer-badge-before">До</span>
        <span className="visualizer-badge visualizer-badge-after visualizer-badge-pride">После · PRIDE</span>

        <div
          className="visualizer-divider"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <span className="visualizer-handle">
            <svg viewBox="0 0 34 18" fill="none" aria-hidden="true">
              <path d="M13 3 7 9l6 6M21 3l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>

    </div>
  );
}
