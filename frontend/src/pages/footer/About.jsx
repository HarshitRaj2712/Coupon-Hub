import React from "react";
import {
  Users,
  ShieldCheck,
  Zap,
  Heart,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

export default function About() {
  return (
    <div className="w-full bg-[var(--bg-main)] text-[var(--text-main)]">

      {/* ================= HERO ================= */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-[#F1E7E4] to-[var(--bg-main)]">
        <span className="inline-block mb-4 px-4 py-1 rounded-full text-sm font-medium bg-[#E6C9CE] text-[#6F1D2C]">
          About CouponHub
        </span>

        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-5">
          Redefining Smart Saving
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-[var(--text-muted)]">
          CouponHub helps users discover verified coupons and deals in one
          place. Built with modern technology to make saving simple,
          transparent, and fast.
        </p>
      </section>

      {/* ================= TEAM ================= */}
<section className="py-20 px-4">
  <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-4">
    Meet the Developer
  </h2>
  <p className="text-center text-[var(--text-muted)] mb-12">
    The mind behind CouponHub
  </p>

  <div className="max-w-md mx-auto">
    <div className="card-default p-8 text-center hover:shadow-xl transition">
      {/* Avatar */}
      <div
        className="w-28 h-28 mx-auto rounded-full flex items-center justify-center text-3xl font-bold mb-4"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        H
      </div>

      <h3 className="text-xl font-semibold">Harshit Raj</h3>
      <p className="text-sm text-[var(--text-muted)] mb-3">
        Full Stack MERN Developer
      </p>

      <p className="text-sm text-[var(--text-muted)]">
        Focused on building scalable backend APIs, secure authentication,
        and clean user experiences using the MERN stack.
      </p>

      {/* SOCIAL LINKS */}
      <div className="flex justify-center gap-5 mt-6">
        <a
          href="https://github.com/HarshitRaj2712"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-full hover:bg-[var(--bg-muted)] transition"
        >
          <Github size={18} />
        </a>

        <a
          href="https://www.linkedin.com/in/harshit-raj-10931b282/"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-full hover:bg-[var(--bg-muted)] transition"
        >
          <Linkedin size={18} />
        </a>

        <a
          href="mailto:panditjee2712@example.com"
          className="p-2 rounded-full hover:bg-[var(--bg-muted)] transition"
        >
          <Mail size={18} />
        </a>
      </div>
    </div>
  </div>
</section>


      {/* ================= VALUES ================= */}
      <section className="py-20 bg-[#EFE6E4] px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <ValueCard icon={<Users />} title="User Focused" text="Designed to help users save money effortlessly." />
          <ValueCard icon={<ShieldCheck />} title="Verified Coupons" text="Only real and tested deals." />
          <ValueCard icon={<Zap />} title="Fast & Simple" text="Clean UI with instant access to deals." />
          <ValueCard icon={<Heart />} title="Built with Care" text="Crafted as a real-world academic project." />
        </div>
      </section>

      {/* ================= TECH STACK ================= */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
          Built With Modern Technology
        </h2>
        <p className="text-[var(--text-muted)] mb-10">
          Tools and frameworks used in CouponHub
        </p>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {[
            "React",
            "Node.js",
            "Express.js",
            "MongoDB",
            "JWT Auth",
            "Tailwind CSS",
          ].map((tech) => (
            <span
                key={tech}
                className="
                    px-8 py-4
                    rounded-2xl
                    border
                    text-base md:text-lg
                    font-medium
                    transition-all duration-300
                    hover:scale-110 hover:shadow-xl
                    cursor-default
                "
                style={{
                    borderColor: "var(--border-color)",
                    background: "var(--bg-panel)",
                }}
                >
                {tech}
            </span>

          ))}
        </div>
      </section>
    </div>
  );
}

/* ================= VALUE CARD ================= */
function ValueCard({ icon, title, text }) {
  return (
    <div className="card-default p-6 text-center hover:shadow-md transition">
      <div
        className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
        style={{
          background: "var(--accent-soft)",
          color: "var(--accent)",
        }}
      >
        {icon}
      </div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-[var(--text-muted)]">{text}</p>
    </div>
  );
}
