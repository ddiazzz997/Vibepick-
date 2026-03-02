'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SplineScene } from "@/components/ui/splite"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import CodeRain from './CodeRain'
import Logo from './Logo'

import { useLang } from '../lib/i18n'

interface WelcomeScreenProps {
    onEnter: () => void
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
    const [isExiting, setIsExiting] = useState(false)
    const { t } = useLang()

    const handleEnter = () => {
        setIsExiting(true)
        setTimeout(onEnter, 800) // Give exit animation time to play
    }

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    <Card className="w-full h-full bg-black border-none rounded-none relative overflow-hidden">
                        {/* Deep blue radial glow across the entire screen for a uniform blue shade */}
                        <motion.div
                            className="absolute inset-0 z-0"
                            animate={{ opacity: [0.6, 0.8, 0.6] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                background: 'radial-gradient(circle at 70% 50%, rgba(0, 119, 255, 0.15) 0%, rgba(0, 60, 180, 0.05) 50%, transparent 100%)',
                            }}
                        />

                        {/* Secondary cyan glow to enhance the overall blue hue */}
                        <motion.div
                            className="absolute inset-0 z-0"
                            animate={{ opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                            style={{
                                background: 'radial-gradient(circle at 30% 30%, rgba(14, 165, 233, 0.1) 0%, transparent 60%)',
                            }}
                        />

                        {/* Falling code animation behind everything */}
                        <CodeRain className="absolute inset-0 pointer-events-none z-0 opacity-30" />

                        <Spotlight
                            className="-top-40 left-0 md:left-60 md:-top-20"
                            fill="#0077ff"
                        />

                        <div className="flex flex-col md:flex-row h-full items-center">
                            {/* Left content */}
                            <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center items-center md:items-start text-center md:text-left">
                                {/* Logo Above Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="mb-8"
                                >
                                    <Logo className="h-12 md:h-16" />
                                </motion.div>
                                {/* Main title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.7 }}
                                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5"
                                >
                                    <span className="text-white">{t.welcomeTitle1}</span>
                                    <br />
                                    <span
                                        className="bg-clip-text text-transparent shimmer-text"
                                        style={{
                                            backgroundImage: 'linear-gradient(90deg, #0077ff, #0ea5e9, #3b82f6, #06b6d4, #0ea5e9, #0077ff)',
                                            backgroundSize: '200% auto',
                                        }}
                                    >
                                        {t.welcomeTitle2}
                                    </span>
                                </motion.h1>

                                {/* Subtitle */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.6 }}
                                    className="text-base sm:text-lg text-neutral-400 max-w-md leading-relaxed mb-8"
                                >
                                    {t.welcomeSubtitle}
                                </motion.p>

                                {/* Enter button (High Conversion CTA) */}
                                <motion.button
                                    onClick={handleEnter}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 200 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="
                                        group relative overflow-hidden
                                        px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-base sm:text-lg text-white
                                        bg-[#0077ff] border border-[#0077ff]/50
                                        shadow-[0_0_30px_rgba(0,119,255,0.4)]
                                        cursor-pointer transition-all duration-300
                                        hover:shadow-[0_0_50px_rgba(0,119,255,0.6)]
                                    "
                                >
                                    {/* Animated light sweep */}
                                    <motion.div
                                        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                        animate={{ left: ['-100%', '200%'] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                                    />

                                    <span className="relative z-10 flex items-center gap-2">
                                        {t.welcomeCTA}
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                        </svg>
                                    </span>
                                </motion.button>
                            </div>

                            {/* Right content — 3D Robot with blue accents */}
                            <div className="flex-1 relative w-full h-[300px] md:h-full">
                                {/* The Spline scene */}
                                <SplineScene
                                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                                    className="w-full h-full relative z-[1]"
                                />

                                {/* Blue tint overlay — gives the robot a subtle blue sheen */}
                                <div
                                    className="absolute inset-0 z-[2] pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(0, 119, 255, 0.08) 0%, rgba(0, 60, 180, 0.12) 50%, rgba(0, 0, 0, 0) 100%)',
                                        mixBlendMode: 'screen',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Bottom glow line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0077ff]/30 to-transparent" />
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
