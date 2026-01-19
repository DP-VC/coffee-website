"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import Preloader from "./Preloader";
import ScrollText from "./ScrollText";

const TOTAL_FRAMES = 154;
const FRAME_PATH = "/coffee-website/sequence/ezgif-frame-";

// Generate frame URLs
const getFrameUrl = (index: number): string => {
    const paddedIndex = String(index).padStart(3, "0");
    return `${FRAME_PATH}${paddedIndex}.jpg`;
};

export default function CoffeeScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [loadProgress, setLoadProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll progress to frame index
    const frameIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [1, TOTAL_FRAMES]
    );

    // Preload all images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            let loaded = 0;

            const loadImage = (index: number): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        loaded++;
                        setLoadProgress((loaded / TOTAL_FRAMES) * 100);
                        resolve(img);
                    };
                    img.onerror = reject;
                    img.src = getFrameUrl(index);
                });
            };

            // Load images in parallel batches for better performance
            const batchSize = 10;
            for (let i = 1; i <= TOTAL_FRAMES; i += batchSize) {
                const batch = [];
                for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES + 1); j++) {
                    batch.push(loadImage(j));
                }
                const results = await Promise.all(batch);
                loadedImages.push(...results);
            }

            setImages(loadedImages);
            // Small delay before revealing for smooth transition
            setTimeout(() => setIsLoaded(true), 300);
        };

        loadImages();
    }, []);

    // Draw frame on canvas with object-contain behavior
    const drawFrame = useCallback(
        (frameNum: number) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            const img = images[frameNum - 1];

            if (!canvas || !ctx || !img) return;

            // Set canvas size to match window
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            // Clear canvas with background color
            ctx.fillStyle = "#00735C";
            ctx.fillRect(0, 0, rect.width, rect.height);

            // Calculate object-contain dimensions
            const imgAspect = img.width / img.height;
            const canvasAspect = rect.width / rect.height;

            let drawWidth, drawHeight, drawX, drawY;

            if (imgAspect > canvasAspect) {
                // Image is wider - fit to width
                drawWidth = rect.width;
                drawHeight = rect.width / imgAspect;
                drawX = 0;
                drawY = (rect.height - drawHeight) / 2;
            } else {
                // Image is taller - fit to height
                drawHeight = rect.height;
                drawWidth = rect.height * imgAspect;
                drawX = (rect.width - drawWidth) / 2;
                drawY = 0;
            }

            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        },
        [images]
    );

    // Update frame on scroll
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const frame = Math.min(Math.max(Math.round(latest), 1), TOTAL_FRAMES);
        if (frame !== currentFrame) {
            setCurrentFrame(frame);
            requestAnimationFrame(() => drawFrame(frame));
        }
    });

    // Initial draw and resize handling
    useEffect(() => {
        if (isLoaded && images.length > 0) {
            drawFrame(1);

            const handleResize = () => {
                drawFrame(currentFrame || 1);
            };

            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, [isLoaded, images, drawFrame, currentFrame]);

    return (
        <>
            <Preloader progress={loadProgress} isComplete={isLoaded} />

            <div ref={containerRef} className="relative h-[600vh]">
                {/* Sticky Canvas Container */}
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                        style={{ backgroundColor: "#00735C" }}
                    />

                    {/* Gradient overlays for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* Text Overlays */}
                {isLoaded && <ScrollText containerRef={containerRef} />}
            </div>
        </>
    );
}
