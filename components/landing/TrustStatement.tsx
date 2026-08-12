"use client";

import { motion, MotionConfig } from "framer-motion";
import { fadeUp, viewport } from "@/components/landing/motion";

export default function TrustStatement() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Simple storage.{" "}
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                Powerful organization.
              </span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/50">
              Venthen Space keeps your personal files organized and accessible
              — without unnecessary complexity.
            </p>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}