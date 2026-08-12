"use client";

import { UploadCloud, FolderTree, Search } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { fadeUp, viewport } from "@/components/landing/motion";

const steps = [
  {
    number: "01",
    icon: UploadCloud,
    title: "Upload",
    description: "Drag your images into your private space.",
  },
  {
    number: "02",
    icon: FolderTree,
    title: "Organize",
    description: "Create folders and keep everything structured.",
  },
  {
    number: "03",
    icon: Search,
    title: "Access",
    description: "Find, download, or manage your files whenever you need them.",
  },
];

export default function Workflow() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="how-it-works" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-medium uppercase tracking-widest text-orange-400">
              How it works
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Upload. Organize. Access.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/50">
              A simple workflow that matches how you actually work with files.
            </p>
          </motion.div>

          <div className="relative mt-16">
            {/* Connecting line */}
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent lg:block" />

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewport}
                  variants={fadeUp}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0d0d0f] shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                      <step.icon className="h-6 w-6 text-orange-400" />
                    </div>
                    <div className="mt-6">
                      <span className="text-sm font-medium text-orange-400/60">
                        {step.number}
                      </span>
                      <h3 className="mt-1 text-xl font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-white/45">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}