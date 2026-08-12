"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import ProductPreview from "@/components/landing/ProductPreview";
import { staggerContainer, fadeUp } from "@/components/landing/motion";

export default function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/[0.09] blur-[140px]" />
          <div className="absolute left-[15%] top-[30%] h-[300px] w-[300px] rounded-full bg-amber-400/[0.05] blur-[100px]" />
          <div className="absolute right-[10%] top-[50%] h-[200px] w-[200px] rounded-full bg-orange-600/[0.04] blur-[80px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            {/* Announcement badge */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[13px] text-white/60 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-orange-400" />
                Your files. Your space. Your control.
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeUp}
              className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
            >
              Your private space for{" "}
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                everything you create.
              </span>
            </motion.h1>

            {/* Supporting copy */}
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50"
            >
              Store, organize, and access your images in one simple private
              workspace built for the way you work.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Link
                href="/sign-up"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-[15px] font-medium text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:bg-orange-400 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] sm:w-auto"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.03] px-7 py-3.5 text-[15px] font-medium text-white/80 transition-colors hover:border-white/[0.2] hover:text-white sm:w-auto"
              >
                Explore the Space
              </Link>
            </motion.div>
          </motion.div>

          {/* Product preview */}
          <div className="mt-16 sm:mt-20">
            <ProductPreview />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}