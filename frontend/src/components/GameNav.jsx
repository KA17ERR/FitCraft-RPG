import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PixelCard from "./PixelCard";
import { cx } from "../utils/cx";
import {
  HomeIcon,
  DumbbellIcon,
  AppleIcon,
  WaterDropIcon,
  ChartIcon,
  ShieldIcon,
  ShopIcon,
} from "./icons/PixelIcons";

// Single source of truth for the RPG-style main navigation. Add a new
// destination by adding an entry here — every screen that renders
// <GameNav /> picks it up automatically.
const NAV_ITEMS = [
  { key: "dashboard", label: "Home", path: "/dashboard", icon: HomeIcon },
  { key: "workout", label: "Workout", path: "/workout", icon: DumbbellIcon },
  { key: "nutrition", label: "Nutrition", path: "/nutrition", icon: AppleIcon },
  { key: "water", label: "Water", path: "/water", icon: WaterDropIcon },
  { key: "progress", label: "Progress", path: "/progress", icon: ChartIcon },
  { key: "character", label: "Character", path: "/character/create", icon: ShieldIcon },
  { key: "shop", label: "Shop", path: "/shop", icon: ShopIcon },
];

/**
 * GameNav — sticky, horizontally-scrollable pixel tab bar used to move
 * between the main game screens. Purely client-side routing; no auth or
 * data logic lives here.
 */
export default function GameNav({ className = "" }) {
  const location = useLocation();

  return (
    <PixelCard
      as="nav"
      variant="panel"
      className={cx("sticky top-2 z-40 mb-6", className)}
    >
      <div className="-m-1 flex gap-2 overflow-x-auto p-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.key} to={item.path} className="shrink-0" aria-current={isActive ? "page" : undefined}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.12 }}
                className={cx(
                  "pixel-corners-sm flex min-w-[64px] flex-col items-center gap-1 border-2 px-3 py-2 font-heading text-[8px] uppercase tracking-widest transition-colors duration-150",
                  isActive
                    ? "border-accent bg-accent/15 text-accent-light"
                    : "border-border bg-panel-raised text-muted hover:border-border-light hover:text-[#fffffe]"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </PixelCard>
  );
}
