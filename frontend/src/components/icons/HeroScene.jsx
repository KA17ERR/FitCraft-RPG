import { motion } from "framer-motion";

/**
 * HeroScene — large original pixel-art illustration for the landing page
 * hero section. A fitness-RPG champion hoisting a glowing barbell overhead,
 * standing on a stone pedestal, rendered entirely from <rect> primitives on
 * a 24x30 grid (no external art, no third-party characters/assets).
 */
export default function HeroScene({ className = "" }) {
  return (
    <motion.svg
      viewBox="0 0 24 30"
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="Pixel-art RPG hero hoisting a glowing barbell"
    >
      {/* ambient glow behind the hero */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        fill="url(#heroGlow)"
        initial={{ opacity: 0.35 }}
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#3ecf5f" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3ecf5f" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floating sparkles */}
      <motion.rect
        x="2" y="4" width="1" height="1" fill="#fde047"
        animate={{ opacity: [0, 1, 0], y: [4, 2, 4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.rect
        x="21" y="7" width="1" height="1" fill="#fef9c3"
        animate={{ opacity: [0, 1, 0], y: [7, 5, 7] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.rect
        x="19" y="18" width="1" height="1" fill="#86efac"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
      />

      {/* cape */}
      <path
        d="M6 10 L4 22 L9 20 L9 10 Z M18 10 L20 22 L15 20 L15 10 Z"
        fill="#1f8a3d"
        opacity="0.85"
      />

      {/* barbell held overhead */}
      <g>
        <rect x="5" y="0" width="2" height="3" fill="#eab308" />
        <rect x="5.5" y="0.5" width="1" height="1" fill="#fef9c3" />
        <rect x="17" y="0" width="2" height="3" fill="#eab308" />
        <rect x="17.5" y="0.5" width="1" height="1" fill="#fef9c3" />
        <rect x="7" y="1" width="10" height="1" fill="#8891b8" />
        <rect x="7" y="0.6" width="10" height="0.4" fill="#c3cbe8" />
      </g>

      {/* arms raised to the bar */}
      <rect x="7" y="3" width="1.4" height="5" fill="#3ecf5f" />
      <rect x="15.6" y="3" width="1.4" height="5" fill="#3ecf5f" />
      <rect x="6.6" y="2" width="1.6" height="1.6" fill="#f4c99b" />
      <rect x="15.8" y="2" width="1.6" height="1.6" fill="#f4c99b" />

      {/* head */}
      <rect x="9.5" y="3" width="5" height="4.2" fill="#f4c99b" />
      <rect x="9.5" y="2.2" width="5" height="1" fill="#1f8a3d" />
      <rect x="9.5" y="1.6" width="5" height="0.7" fill="#3ecf5f" />
      <rect x="10.3" y="5" width="0.8" height="0.8" fill="#16213e" />
      <rect x="12.9" y="5" width="0.8" height="0.8" fill="#16213e" />

      {/* torso / armor */}
      <rect x="8.6" y="7.2" width="6.8" height="7" fill="#3ecf5f" />
      <rect x="8.6" y="7.2" width="6.8" height="1" fill="#86efac" />
      <rect x="11.2" y="9.6" width="1.6" height="1.6" fill="#fde047" />
      <rect x="8.6" y="14.2" width="6.8" height="1.2" fill="#eab308" />

      {/* legs */}
      <rect x="9" y="15.4" width="2.2" height="6.4" fill="#1f8a3d" />
      <rect x="12.8" y="15.4" width="2.2" height="6.4" fill="#1f8a3d" />
      <rect x="8.8" y="21.4" width="2.6" height="1.6" fill="#16213e" />
      <rect x="12.6" y="21.4" width="2.6" height="1.6" fill="#16213e" />

      {/* pedestal */}
      <rect x="3" y="24" width="18" height="1.4" fill="#86efac" />
      <rect x="2" y="25.4" width="20" height="2.6" fill="#3f4d81" />
      <rect x="2" y="27.6" width="20" height="1.4" fill="#232f57" />

      {/* level badge */}
      <g>
        <rect x="15.5" y="16" width="6" height="4" fill="#16213e" stroke="#fde047" strokeWidth="0.3" />
        <text
          x="18.5"
          y="18.8"
          textAnchor="middle"
          fontSize="2"
          fill="#fde047"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          LV12
        </text>
      </g>
    </motion.svg>
  );
}
