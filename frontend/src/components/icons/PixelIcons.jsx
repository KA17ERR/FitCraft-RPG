// Small, original pixel-grid icons built from <rect> primitives on an 8x8 or
// 10x10 grid. No third-party characters, logos, or copyrighted assets — just
// simple geometric pixel-art in the spirit of retro RPG UI iconography.

function Grid({ size = 20, viewBox = "0 0 8 8", children, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function CoinIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="2" y="1" width="4" height="1" fill="#c9971f" />
      <rect x="1" y="2" width="1" height="4" fill="#c9971f" />
      <rect x="6" y="2" width="1" height="4" fill="#c9971f" />
      <rect x="2" y="6" width="4" height="1" fill="#c9971f" />
      <rect x="2" y="2" width="4" height="4" fill="#ffd166" />
      <rect x="3" y="2" width="2" height="1" fill="#fff1c4" />
      <rect x="3" y="3" width="1" height="1" fill="#fff1c4" />
    </Grid>
  );
}

export function XPIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="4" y="0" width="1" height="1" fill="#fef9c3" />
      <rect x="3" y="1" width="2" height="1" fill="#fde047" />
      <rect x="2" y="2" width="3" height="1" fill="#fde047" />
      <rect x="1" y="3" width="4" height="1" fill="#eab308" />
      <rect x="3" y="4" width="2" height="1" fill="#fde047" />
      <rect x="4" y="5" width="2" height="1" fill="#fde047" />
      <rect x="5" y="6" width="2" height="1" fill="#fef9c3" />
      <rect x="6" y="7" width="1" height="1" fill="#fef9c3" />
    </Grid>
  );
}

export function HeartIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="1" y="1" width="2" height="1" fill="#ff5d5d" />
      <rect x="5" y="1" width="2" height="1" fill="#ff5d5d" />
      <rect x="0" y="2" width="3" height="1" fill="#ff5d5d" />
      <rect x="5" y="2" width="3" height="1" fill="#ff5d5d" />
      <rect x="0" y="3" width="8" height="1" fill="#ff5d5d" />
      <rect x="1" y="4" width="6" height="1" fill="#ff5d5d" />
      <rect x="2" y="5" width="4" height="1" fill="#ff5d5d" />
      <rect x="3" y="6" width="2" height="1" fill="#ff5d5d" />
      <rect x="2" y="2" width="1" height="1" fill="#ff9d9d" />
    </Grid>
  );
}

export function SwordIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="6" y="0" width="1" height="1" fill="#dbe4ff" />
      <rect x="5" y="1" width="1" height="1" fill="#dbe4ff" />
      <rect x="4" y="2" width="1" height="1" fill="#dbe4ff" />
      <rect x="3" y="3" width="1" height="1" fill="#dbe4ff" />
      <rect x="2" y="4" width="1" height="1" fill="#a7b4e0" />
      <rect x="1" y="4" width="3" height="1" fill="#7c88b8" />
      <rect x="1" y="5" width="1" height="1" fill="#5c6b9a" />
      <rect x="0" y="6" width="1" height="1" fill="#c9971f" />
    </Grid>
  );
}

export function ShieldIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="2" y="0" width="4" height="1" fill="#6c7cc0" />
      <rect x="1" y="1" width="6" height="1" fill="#8fa0e0" />
      <rect x="1" y="2" width="6" height="2" fill="#dbe4ff" />
      <rect x="1" y="4" width="6" height="1" fill="#8fa0e0" />
      <rect x="2" y="5" width="4" height="1" fill="#6c7cc0" />
      <rect x="3" y="6" width="2" height="1" fill="#3f4d81" />
    </Grid>
  );
}

export function StarIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="3" y="0" width="2" height="1" fill="#ffd166" />
      <rect x="3" y="1" width="2" height="1" fill="#ffe9b0" />
      <rect x="0" y="2" width="8" height="1" fill="#ffd166" />
      <rect x="1" y="3" width="6" height="1" fill="#ffe9b0" />
      <rect x="2" y="4" width="4" height="1" fill="#ffd166" />
      <rect x="1" y="5" width="2" height="1" fill="#ffd166" />
      <rect x="5" y="5" width="2" height="1" fill="#ffd166" />
    </Grid>
  );
}

export function FlameIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="3" y="0" width="1" height="1" fill="#ffd166" />
      <rect x="2" y="1" width="2" height="1" fill="#ff9d3d" />
      <rect x="2" y="2" width="3" height="1" fill="#ff9d3d" />
      <rect x="1" y="3" width="4" height="1" fill="#e94560" />
      <rect x="1" y="4" width="4" height="1" fill="#e94560" />
      <rect x="2" y="5" width="3" height="1" fill="#a72e46" />
      <rect x="3" y="6" width="1" height="1" fill="#a72e46" />
    </Grid>
  );
}

export function LockIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="2" y="0" width="4" height="1" fill="#8891b8" />
      <rect x="2" y="1" width="1" height="2" fill="#8891b8" />
      <rect x="5" y="1" width="1" height="2" fill="#8891b8" />
      <rect x="1" y="3" width="6" height="4" fill="#5c6b9a" />
      <rect x="3" y="4" width="2" height="2" fill="#0b0e1a" />
    </Grid>
  );
}

export function CheckIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="6" y="1" width="1" height="1" fill="#4ade80" />
      <rect x="5" y="2" width="1" height="1" fill="#4ade80" />
      <rect x="4" y="3" width="1" height="1" fill="#4ade80" />
      <rect x="3" y="4" width="1" height="1" fill="#4ade80" />
      <rect x="2" y="3" width="1" height="1" fill="#4ade80" />
      <rect x="1" y="2" width="1" height="1" fill="#4ade80" />
    </Grid>
  );
}

export function DumbbellIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="0" y="2" width="1" height="4" fill="#1f8a3d" />
      <rect x="1" y="1" width="1" height="6" fill="#3ecf5f" />
      <rect x="2" y="3" width="1" height="2" fill="#86efac" />
      <rect x="3" y="3" width="2" height="2" fill="#86efac" />
      <rect x="5" y="3" width="1" height="2" fill="#86efac" />
      <rect x="6" y="1" width="1" height="6" fill="#3ecf5f" />
      <rect x="7" y="2" width="1" height="4" fill="#1f8a3d" />
    </Grid>
  );
}

export function WaterDropIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="3" y="0" width="2" height="1" fill="#7dd3fc" />
      <rect x="2" y="1" width="1" height="1" fill="#38bdf8" />
      <rect x="5" y="1" width="1" height="1" fill="#38bdf8" />
      <rect x="1" y="2" width="1" height="1" fill="#38bdf8" />
      <rect x="6" y="2" width="1" height="1" fill="#38bdf8" />
      <rect x="1" y="3" width="6" height="2" fill="#38bdf8" />
      <rect x="1" y="5" width="6" height="1" fill="#0ea5e9" />
      <rect x="2" y="6" width="4" height="1" fill="#0ea5e9" />
      <rect x="2" y="3" width="1" height="1" fill="#bae6fd" />
    </Grid>
  );
}

export function AppleIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="4" y="0" width="1" height="1" fill="#1f8a3d" />
      <rect x="2" y="1" width="1" height="1" fill="#3ecf5f" />
      <rect x="2" y="2" width="4" height="1" fill="#fde047" />
      <rect x="1" y="3" width="6" height="2" fill="#fde047" />
      <rect x="1" y="5" width="6" height="1" fill="#eab308" />
      <rect x="2" y="6" width="4" height="1" fill="#eab308" />
      <rect x="2" y="3" width="1" height="1" fill="#fef9c3" />
    </Grid>
  );
}

export function ChartIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="0" y="7" width="8" height="1" fill="#6c7cc0" />
      <rect x="1" y="5" width="1" height="2" fill="#fde047" />
      <rect x="3" y="3" width="1" height="4" fill="#3ecf5f" />
      <rect x="5" y="1" width="1" height="6" fill="#86efac" />
      <rect x="6" y="0" width="1" height="1" fill="#fef9c3" />
    </Grid>
  );
}

export function QuestIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="2" y="0" width="4" height="1" fill="#fde047" />
      <rect x="1" y="1" width="1" height="4" fill="#fde047" />
      <rect x="6" y="1" width="1" height="4" fill="#fde047" />
      <rect x="3" y="2" width="2" height="2" fill="#fde047" />
      <rect x="3" y="5" width="2" height="1" fill="#fde047" />
      <rect x="3" y="7" width="2" height="1" fill="#fde047" />
    </Grid>
  );
}

export function LevelUpIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="4" y="0" width="1" height="1" fill="#3ecf5f" />
      <rect x="3" y="1" width="3" height="1" fill="#3ecf5f" />
      <rect x="2" y="2" width="5" height="1" fill="#3ecf5f" />
      <rect x="4" y="2" width="1" height="3" fill="#86efac" />
      <rect x="4" y="4" width="1" height="1" fill="#3ecf5f" />
      <rect x="3" y="6" width="3" height="1" fill="#1f8a3d" />
      <rect x="1" y="7" width="7" height="1" fill="#1f8a3d" />
    </Grid>
  );
}

export function EyeIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="3" y="2" width="2" height="1" fill="#8891b8" />
      <rect x="2" y="3" width="1" height="1" fill="#8891b8" />
      <rect x="5" y="3" width="1" height="1" fill="#8891b8" />
      <rect x="1" y="4" width="1" height="1" fill="#8891b8" />
      <rect x="6" y="4" width="1" height="1" fill="#8891b8" />
      <rect x="2" y="5" width="1" height="1" fill="#8891b8" />
      <rect x="5" y="5" width="1" height="1" fill="#8891b8" />
      <rect x="3" y="6" width="2" height="1" fill="#8891b8" />
      <rect x="3" y="3" width="2" height="3" fill="#c3cbe8" />
      <rect x="3.5" y="3.5" width="1" height="2" fill="#16213e" />
    </Grid>
  );
}

export function EyeOffIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="3" y="2" width="2" height="1" fill="#8891b8" />
      <rect x="2" y="3" width="1" height="1" fill="#8891b8" />
      <rect x="5" y="3" width="1" height="1" fill="#8891b8" />
      <rect x="1" y="4" width="1" height="1" fill="#8891b8" />
      <rect x="6" y="4" width="1" height="1" fill="#8891b8" />
      <rect x="2" y="5" width="1" height="1" fill="#8891b8" />
      <rect x="5" y="5" width="1" height="1" fill="#8891b8" />
      <rect x="3" y="6" width="2" height="1" fill="#8891b8" />
      <rect x="3" y="3" width="2" height="3" fill="#c3cbe8" />
      <rect x="1" y="1" width="1" height="1" fill="#6c7cc0" />
      <rect x="2" y="2" width="1" height="1" fill="#6c7cc0" />
      <rect x="3" y="3" width="1" height="1" fill="#6c7cc0" />
      <rect x="4" y="4" width="1" height="1" fill="#6c7cc0" />
      <rect x="5" y="5" width="1" height="1" fill="#6c7cc0" />
      <rect x="6" y="6" width="1" height="1" fill="#6c7cc0" />
    </Grid>
  );
}

export function HomeIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="3" y="0" width="2" height="1" fill="#fde047" />
      <rect x="2" y="1" width="4" height="1" fill="#eab308" />
      <rect x="1" y="2" width="6" height="1" fill="#eab308" />
      <rect x="1" y="3" width="6" height="4" fill="#8891b8" />
      <rect x="1" y="3" width="6" height="1" fill="#c3cbe8" />
      <rect x="3" y="5" width="2" height="2" fill="#0b0e1a" />
    </Grid>
  );
}

export function PlusIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="3" y="1" width="2" height="6" fill="#3ecf5f" />
      <rect x="1" y="3" width="6" height="2" fill="#3ecf5f" />
    </Grid>
  );
}

export function ScaleIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="2" y="0" width="4" height="1" fill="#8891b8" />
      <rect x="1" y="1" width="6" height="1" fill="#8891b8" />
      <rect x="0" y="2" width="8" height="4" fill="#c3cbe8" />
      <rect x="3" y="3" width="2" height="2" fill="#16213e" />
      <rect x="1" y="6" width="6" height="1" fill="#8891b8" />
      <rect x="2" y="7" width="4" height="1" fill="#8891b8" />
    </Grid>
  );
}

export function TargetIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="1" y="1" width="6" height="6" fill="#ff5d5d" />
      <rect x="2" y="2" width="4" height="4" fill="#fffffe" />
      <rect x="3" y="3" width="2" height="2" fill="#ff5d5d" />
    </Grid>
  );
}

export function TrophyIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="2" y="0" width="4" height="1" fill="#ffd166" />
      <rect x="1" y="1" width="6" height="2" fill="#ffd166" />
      <rect x="0" y="1" width="1" height="2" fill="#c9971f" />
      <rect x="7" y="1" width="1" height="2" fill="#c9971f" />
      <rect x="2" y="3" width="4" height="1" fill="#c9971f" />
      <rect x="3" y="4" width="2" height="2" fill="#ffd166" />
      <rect x="2" y="6" width="4" height="1" fill="#c9971f" />
    </Grid>
  );
}

export function ShopIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="0" y="0" width="2" height="2" fill="#e94560" />
      <rect x="2" y="0" width="2" height="2" fill="#fffffe" />
      <rect x="4" y="0" width="2" height="2" fill="#e94560" />
      <rect x="6" y="0" width="2" height="2" fill="#fffffe" />
      <rect x="0" y="2" width="8" height="1" fill="#c9971f" />
      <rect x="1" y="3" width="6" height="4" fill="#6c7cc0" />
      <rect x="3" y="4" width="2" height="3" fill="#0b0e1a" />
      <rect x="1" y="3" width="6" height="1" fill="#8fa0e0" />
    </Grid>
  );
}

export function EditIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="5" y="0" width="2" height="2" fill="#ffe9b0" />
      <rect x="4" y="1" width="2" height="2" fill="#ffd166" />
      <rect x="3" y="2" width="2" height="2" fill="#ffd166" />
      <rect x="2" y="3" width="2" height="2" fill="#eab308" />
      <rect x="1" y="4" width="2" height="2" fill="#eab308" />
      <rect x="0" y="5" width="2" height="2" fill="#c9971f" />
      <rect x="0" y="6" width="1" height="1" fill="#3a2a00" />
    </Grid>
  );
}

export function TrashIcon({ size = 20, className = "" }) {
  return (
    <Grid size={size} className={className}>
      <rect x="2" y="0" width="4" height="1" fill="#8891b8" />
      <rect x="0" y="1" width="8" height="1" fill="#c3cbe8" />
      <rect x="1" y="2" width="6" height="5" fill="#ff8080" />
      <rect x="2" y="3" width="1" height="3" fill="#a72e46" />
      <rect x="4" y="3" width="1" height="3" fill="#a72e46" />
      <rect x="6" y="3" width="1" height="3" fill="#a72e46" />
      <rect x="1" y="7" width="6" height="1" fill="#a72e46" />
    </Grid>
  );
}
