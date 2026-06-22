"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type WheelDetailGalleryProps = {
  images: string[];
  title: string;
};

export function WheelDetailGallery({ images, title }: WheelDetailGalleryProps) {
  const safeImages = images.filter((image): image is string => typeof image === "string" && image.length > 0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const hasMultipleImages = safeImages.length > 1;
  const currentImage = safeImages[currentImageIndex] ?? safeImages[0];

  const showPrev = useCallback(() => {
    setCurrentImageIndex((index) => (index === 0 ? safeImages.length - 1 : index - 1));
  }, [safeImages.length]);

  const showNext = useCallback(() => {
    setCurrentImageIndex((index) => (index === safeImages.length - 1 ? 0 : index + 1));
  }, [safeImages.length]);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsViewerOpen(false);
      if (event.key === "ArrowLeft" && hasMultipleImages) showPrev();
      if (event.key === "ArrowRight" && hasMultipleImages) showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasMultipleImages, isViewerOpen, showNext, showPrev]);

  if (!currentImage) return null;

  const arrowButton = (direction: "prev" | "next", viewer = false) => (
    <button
      type="button"
      className={`wheel-gallery-arrow wheel-gallery-arrow-${direction} ${viewer ? "wheel-viewer-arrow" : ""}`}
      onClick={(event) => {
        event.stopPropagation();
        direction === "prev" ? showPrev() : showNext();
      }}
      aria-label={direction === "prev" ? "Предыдущее фото" : "Следующее фото"}
    >
      <span aria-hidden="true">{direction === "prev" ? "‹" : "›"}</span>
    </button>
  );

  return (
    <div className="wheel-detail-gallery">
      <div className="wheel-gallery-stage">
        <button
          type="button"
          className="wheel-gallery-zoom"
          onClick={() => setIsViewerOpen(true)}
          aria-label={`Увеличить фото ${title}`}
        >
          <Image
            key={currentImage}
            src={currentImage}
            alt={`Кованый диск ${title}, фото ${currentImageIndex + 1}`}
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 58vw, 94vw"
            className="wheel-gallery-main-image"
          />
        </button>
        {hasMultipleImages && (
          <>
            {arrowButton("prev")}
            {arrowButton("next")}
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="wheel-gallery-thumbnails" aria-label={`Галерея ${title}`}>
          {safeImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              className="wheel-gallery-thumbnail"
              data-active={index === currentImageIndex}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Показать фото ${index + 1}`}
              aria-current={index === currentImageIndex ? "true" : undefined}
            >
              <Image src={image} alt="" fill unoptimized sizes="112px" className="wheel-gallery-thumbnail-image" />
            </button>
          ))}
        </div>
      )}

      {isMounted && createPortal(
        <AnimatePresence>
          {isViewerOpen && (
            <motion.div
              className="wheel-viewer-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={`Просмотр фото ${title}`}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.24 }}
              onClick={() => setIsViewerOpen(false)}
            >
              <button type="button" className="wheel-viewer-close" onClick={() => setIsViewerOpen(false)} aria-label="Закрыть просмотр">
                <span aria-hidden="true">×</span>
              </button>
              {hasMultipleImages && (
                <>
                  {arrowButton("prev", true)}
                  {arrowButton("next", true)}
                </>
              )}
              <motion.div
                className="wheel-viewer-image-wrap"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setIsViewerOpen(false)}
              >
                <Image
                  key={currentImage}
                  src={currentImage}
                  alt={`Кованый диск ${title}, увеличенное фото ${currentImageIndex + 1}`}
                  fill
                  unoptimized
                  sizes="92vw"
                  className="wheel-viewer-image"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
