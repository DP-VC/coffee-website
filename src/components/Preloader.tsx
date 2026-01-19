"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
    progress: number;
    isComplete: boolean;
}

export default function Preloader({ progress, isComplete }: PreloaderProps) {
    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#00735C]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    {/* Logo/Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-12"
                    >
                        <h1 className="font-serif text-5xl md:text-7xl text-white/90 tracking-tight">
                            HOMIE
                        </h1>
                        <p className="text-center font-sans text-lg text-white/60 tracking-[0.3em] mt-2">
                            COFFEE
                        </p>
                    </motion.div>

                    {/* Progress Container */}
                    <div className="w-64 md:w-80">
                        {/* Progress Bar Background */}
                        <div className="h-[2px] w-full bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white/90 origin-left"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: progress / 100 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            />
                        </div>

                        {/* Progress Text */}
                        <motion.div
                            className="flex justify-between items-center mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="text-white/50 text-sm font-sans tracking-wider">
                                Loading experience
                            </span>
                            <span className="text-white/80 text-sm font-sans tabular-nums">
                                {Math.round(progress)}%
                            </span>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <motion.div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-white/30 rounded-full"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.7, 0.3],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
