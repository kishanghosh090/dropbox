"use client";

import {
  Lock,
  UploadCloud,
  FolderTree,
  Star,
  Trash2,
  Zap,
} from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { staggerContainer, fadeUp, viewport } from "@/components/landing/motion";

const features = [
  {
    icon: Lock,
    title: "Private by default",
    description:
      "Your files belong to your space and are organized around your account.",
  },
  {
    icon: UploadCloud,
    title: "Simple uploads",
    description: "Upload images quickly with drag-and-drop support.",
  },
  {
    icon: FolderTree,
    title: "Organized storage",
    description:
      "Use folders and structured organization to keep your workspace clean.",
  },
  {
    icon: Star,
    title: "Star important files",
    description: "Quickly mark frequently accessed files for fast retrieval.",
  },
  {
    icon: Trash2,
    title: "Trash & recovery",
    description:
      "Keep deleted files separated from your active workspace.",
  },
  {
    icon: Zap,
    title: "Fast access",
    description: "Quickly browse, preview, download, and manage your files.",
  },
];

export default function Features() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="features" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-medium uppercase tracking-widest text-orange-400"
            >
              Features
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              Everything you need. Nothing you don't.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg leading-relaxed text-white/50"
            >
              A focused set of tools that keeps your files organized and
              accessible — without unnecessary complexity.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition-colors hover:border-orange-500/20 hover:bg-white/[0.03]"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/[0.06] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                    <feature.icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/45">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}