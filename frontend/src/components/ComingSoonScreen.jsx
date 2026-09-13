import { motion } from "framer-motion";
import GameNav from "./GameNav";
import PixelCard from "./PixelCard";
import Badge from "./Badge";
import { useAuth } from "../context/AuthContext";

/**
 * ComingSoonScreen — shared shell for game screens that are reachable from
 * the main nav but not yet built out (Round 2 scope was the Dashboard).
 * Keeps the same header/nav chrome as Dashboard so moving between tabs
 * feels consistent instead of dead-ending.
 */
export default function ComingSoonScreen({ icon, title, description }) {
  const { user } = useAuth();

  return (
    <div className="relative z-10 min-h-screen px-4 py-6 pb-16 text-[#fffffe] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-4">
          <p className="font-heading text-[9px] uppercase tracking-widest text-muted">FitCraft RPG</p>
          <h1 className="pixel-text-shadow font-heading text-base text-[#fffffe] sm:text-lg">
            {user?.username ? `${user.username}'s ${title}` : title}
          </h1>
        </header>

        <GameNav />

        <PixelCard variant="panel" className="mx-auto max-w-xl text-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border-2 border-border bg-ink pixel-corners-sm"
          >
            {icon}
          </motion.div>
          <Badge variant="xp" size="sm" className="mb-3">
            Under Construction
          </Badge>
          <h2 className="pixel-text-shadow mb-2 font-heading text-sm text-[#fffffe]">{title}</h2>
          <p className="text-sm leading-snug text-muted">{description}</p>
        </PixelCard>
      </div>
    </div>
  );
}
