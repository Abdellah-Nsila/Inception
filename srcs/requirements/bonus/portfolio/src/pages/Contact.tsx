// pages/Contact.tsx
"use client";

import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contact({ sectionIndex }: { sectionIndex: number }) {
  const displayId = String(sectionIndex + 1).padStart(2, "0");
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsPending(true);
    setStatus(null);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_PUBLIC_KEY
      );

      setStatus({ success: true, message: "Message sent successfully!" });
      formRef.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus({ success: false, message: "Failed to send message. Please check your connection." });
    } finally {
      setIsPending(false);
    }
  };

  // Shared responsive, non-legacy input design classes
  const inputStyles = "appearance-none block w-full px-4 py-2.5 text-sm rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 shadow-sm";

  return (
    <section id="contact" className="min-h-[75vh] flex flex-col justify-center py-12 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        
        {/* Left Column: Context & Metadata */}
        <div className="md:col-span-5 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight !text-teal-600 dark:!text-teal-400">
            <span className="font-mono mr-3 opacity-90">{displayId} //</span>
            Let's Connect
          </h2>
          
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm md:text-base">
            Looking to collaborate on low-level architectures, network socket microservices, or secure hypervisor deployment matrices? Drop a connection request.
          </p>

          <div className="pt-2">
            <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
              Alternative Protocol
            </div>
            <a 
              href={`mailto:${import.meta.env.VITE_MY_EMAIL}`}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-800 dark:text-zinc-200 px-4 py-2 font-medium text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Direct Node Mailto
            </a>
          </div>
        </div>

        {/* Right Column: Matte Input Terminal Interface */}
        <div className="md:col-span-7 w-full">
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="space-y-4 w-full relative z-10 p-6 bg-zinc-500/[0.03] dark:bg-white/[0.02] backdrop-blur-md rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl"
          >
            {/* Hidden automated layout timestamp variable */}
            <input 
              type="hidden" 
              name="time" 
              value={new Date().toLocaleString("en-US", { 
                dateStyle: "medium", 
                timeStyle: "short" 
              })} 
            />

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                Name
              </label>
              <input
                type="text"
                name="name" 
                autoComplete="name"
                className={inputStyles}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                className={inputStyles}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                className={inputStyles}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider mb-1.5 text-zinc-500 dark:text-zinc-400">
                Message
              </label>
              <textarea
                name="message"
                rows={4}
                className={`${inputStyles} resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 select-none shadow-md mt-2 cursor-pointer"
            >
              {isPending ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <div className={`text-xs font-mono mt-2 p-2.5 rounded-lg border text-center ${
                status.success 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}>
                {status.message}
              </div>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}