import Link from "next/link";
import { CloudUpload } from "lucide-react";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "About", href: "#about" },
  { label: "Sign in", href: "/sign-in" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function Footer() {
  return (
    <footer id="about" className="relative border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-start">
          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20">
                <CloudUpload className="h-4.5 w-4.5 text-orange-400" />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Venthen Space
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/40">
              A private cloud space for your images and files. Simple storage,
              powerful organization.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/50 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-[13px] text-white/30">
            © 2026 Venthen Space
          </p>
          <p className="text-[13px] text-white/25">
            Built for creators, designers, and everyone with files to keep.
          </p>
        </div>
      </div>
    </footer>
  );
}