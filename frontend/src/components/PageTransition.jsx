import { motion } from "framer-motion";

/**
 * PageTransition — lightweight fade/rise used to wrap each route's element
 * in App.jsx so navigating between screens feels like a soft scene change
 * instead of an abrupt swap. Kept short and subtle on purpose — this runs
 * on every navigation, so it should never feel like it's in the way.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
