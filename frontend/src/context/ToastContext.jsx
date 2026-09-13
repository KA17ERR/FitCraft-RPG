import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

let idCounter = 0;

/**
 * ToastProvider — mount once near the app root. Descendants call
 * useToast().showToast({ title, description, type, duration }) to pop a
 * game-style notification (e.g. "+50 XP", "Quest Complete!") in the
 * bottom-right corner.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, type = "default", duration = 3200 }) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, title, description, type, duration }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Pinned to both edges on mobile (inset-x-4) so its width is
          naturally viewport-32px with no explicit `width` fighting the
          `right` offset — the classic `fixed ... right-4 w-full` combo
          overflows a few px off the left edge on narrow screens. From
          `sm:` up there's enough room to pin only the right edge and cap
          the width instead. */}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-xs">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              title={toast.title}
              description={toast.description}
              type={toast.type}
              duration={toast.duration}
              onDismiss={() => dismiss(toast.id)}
              className="pointer-events-auto"
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
