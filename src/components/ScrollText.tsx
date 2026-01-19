"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface TextSection {
    text: string;
    subtitle?: string;
    position: "center" | "left" | "right";
    startProgress: number;
    endProgress: number;
}

const textSections: TextSection[] = [
    {
        text: "HOMIE Coffee.",
        subtitle: "Pure Origin.",
        position: "center",
        startProgress: 0,
        endProgress: 0.15,
    },
    {
        text: "The journey begins",
        subtitle: "with the cherry.",
        position: "left",
        startProgress: 0.25,
        endProgress: 0.40,
    },
    {
        text: "Roasted for Depth.",
        subtitle: "Ground for Flavor.",
        position: "right",
        startProgress: 0.50,
        endProgress: 0.65,
    },
    {
        text: "Made for",
        subtitle: "the Homies.",
        position: "center",
        startProgress: 0.80,
        endProgress: 1.0,
    },
];

interface ScrollTextProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

export default function ScrollText({ containerRef }: ScrollTextProps) {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        <div className="fixed inset-0 pointer-events-none z-10">
            {textSections.map((section, index) => (
                <TextOverlay
                    key={index}
                    section={section}
                    scrollProgress={scrollYProgress}
                />
            ))}
        </div>
    );
}

interface TextOverlayProps {
    section: TextSection;
    scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function TextOverlay({ section, scrollProgress }: TextOverlayProps) {
    const fadeInStart = section.startProgress;
    const fadeInEnd = section.startProgress + 0.03;
    const fadeOutStart = section.endProgress - 0.03;
    const fadeOutEnd = section.endProgress;

    const opacity = useTransform(
        scrollProgress,
        [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
        [0, 1, 1, 0]
    );

    const y = useTransform(
        scrollProgress,
        [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
        [40, 0, 0, -40]
    );

    const positionClasses = {
        center: "items-center justify-center text-center",
        left: "items-center justify-start text-left pl-8 md:pl-16 lg:pl-24",
        right: "items-center justify-end text-right pr-8 md:pr-16 lg:pr-24",
    };

    const isCTA = section.startProgress >= 0.80;

    return (
        <motion.div
            className={`absolute inset-0 flex ${positionClasses[section.position]}`}
            style={{ opacity }}
        >
            <motion.div style={{ y }} className="max-w-xl">
                <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white/90 leading-tight">
                    {section.text}
                </h2>
                {section.subtitle && (
                    <p className={`font-serif text-3xl md:text-5xl lg:text-6xl mt-2 ${isCTA ? "text-white/90" : "text-white/70"
                        } leading-tight`}>
                        {section.subtitle}
                    </p>
                )}
                {isCTA && (
                    <motion.button
                        className="mt-8 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 
                       text-white font-sans text-sm tracking-widest uppercase
                       hover:bg-white/20 transition-all duration-300 pointer-events-auto"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Explore the Blend
                    </motion.button>
                )}
            </motion.div>
        </motion.div>
    );
}
