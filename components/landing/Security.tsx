"use client";

import {
  ShieldCheck,
  Fingerprint,
  FolderLock,
  UserCheck,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { staggerContainer, fadeUp, viewport } from "@/components/landing/motion";

const securityPoints = [
  {
    icon: UserCheck,
    title: "Authenticated access",
    description: "Every space is tied to your account — files stay with you.",
  },
  {
    icon: FolderLock,
    title: "Private user spaces",
    description: "Your organization lives in a space only you can access.",
  },
  {
    icon: EyeOff,
    title: "Nothing public by default",
    description: "Files stay out of the open web unless you choose otherwise.",
  },
  {
    icon: KeyRound,
    title: "Controlled management",
    description: "Upload, move, star, or delete — you stay in control.",
  },
];

export default function Security() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="security" className="relative py-24 sm:py-32">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-0 top-1/3 h-[380px] w-[380px] rounded-full bg-orange-500/[0.04] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
            {/* Left: heading */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-white/60"
              >
                <ShieldCheck className="h-4 w-4 text-orange-400" />
                Privacy-first
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              >
                Your files should feel like{" "}
                <span className="text-white/40">yours.</span>
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-md text-lg leading-relaxed text-white/50"
              >
                Venthen Space is built around a simple idea: your files belong
                to you. Private spaces, authenticated access, and organized
                ownership — without exposing your work to the open web.
              </motion.p>
            </motion.div>

            {/* Right: security points */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={staggerContainer}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {securityPoints.map((point) => (
                <motion.div
                  key={point.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-orange-500/20 hover:bg-white/[0.03]"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <point.icon className="h-[18px] w-[18px] text-orange-400" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/45">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-5"
          >
            <Fingerprint className="h-5 w-5 shrink-0 text-orange-400" />
            <p className="text-sm leading-relaxed text-white/45">
              No public galleries, no shared links you didn't create. Your
              workspace is organized around your account, so everything you
              upload stays in your space.
            </p>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}