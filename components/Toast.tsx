"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

type Variant = "success" | "error" | "info";
type ToastItem = { id: number; title?: string; description?: string; variant?: Variant; duration?: number };

const ToastCtx = createContext<{ push: (t: Omit<ToastItem, "id">) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = (t: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    const item: ToastItem = { id, duration: 3000, variant: "info", ...t };
    setItems((s) => [...s, item]);
    // auto dismiss
    setTimeout(() => setItems((s) => s.filter((x) => x.id !== id)), item.duration);
  };
  const api = useMemo(() => ({ push }), []);
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[999] flex flex-col gap-3">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: .98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: .98 }}
              className={clsx(
                "pointer-events-auto w-[320px] rounded-2xl p-4 border shadow-lg backdrop-blur-sm",
                "bg-black/70 border-white/10",
                t.variant === "success" && "shadow-[0_8px_28px_rgba(16,185,129,.25)]",
                t.variant === "error"   && "shadow-[0_8px_28px_rgba(244,63,94,.35)]",
                t.variant === "info"    && "shadow-[0_8px_28px_rgba(59,130,246,.25)]",
              )}
            >
              {/* แถบไฮไลต์ตามธีมแดง */}
              <div className={clsx(
                "mb-2 h-1 rounded-full",
                t.variant === "success" ? "bg-emerald-400/80" :
                t.variant === "error"   ? "bg-rose-500/90"   :
                                          "bg-sky-400/80"
              )} />
              {t.title ? <div className="font-semibold">{t.title}</div> : null}
              {t.description ? <div className="text-sm text-white/80">{t.description}</div> : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return {
    toast: (opts: Omit<ToastItem, "id">) => ctx.push(opts),
    success: (title: string, description?: string) => ctx.push({ title, description, variant: "success" }),
    error:   (title: string, description?: string) => ctx.push({ title, description, variant: "error" }),
    info:    (title: string, description?: string) => ctx.push({ title, description, variant: "info" }),
  };
}
