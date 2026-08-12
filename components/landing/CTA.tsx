"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { fadeUp, viewport } from "@/components/landing/motion";

export default function CTA() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d0d0f] px-6 py-20 text-center sm:px-16 sm:py-28"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/[0.14] blur-[120px]" />
              <div className="absolute bottom-0 left-1/4 h-[200px] w-[200px] rounded-full bg-amber-400/[0.08] blur-[80px]" />
            </div>

            {/* Grid lines */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Make space for what matters.
              </h2>
              <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/50">
                Start organizing your files in a space built around you.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 text-[15px] font-medium text-white shadow-[0_0_40px_rgba(249,115,22,0.35)] transition-all hover:bg-orange-400 hover:shadow-[0_0_50px_rgba(249,115,22,0.45)]"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}