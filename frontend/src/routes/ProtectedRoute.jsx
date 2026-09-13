import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCharacter } from "../context/CharacterContext";
import LoadingDots from "../components/LoadingDots";
import { ShieldIcon } from "../components/icons/PixelIcons";

const CHARACTER_CREATE_PATH = "/character/create";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasCharacter } = useCharacter();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-ink text-[#fffffe]">
        <div className="animate-pixel-pulse flex h-14 w-14 items-center justify-center border-2 border-border bg-panel pixel-corners-sm text-accent-light">
          <ShieldIcon size={26} />
        </div>
        <p className="font-heading text-[10px] uppercase tracking-widest text-muted">Loading Quest Log</p>
        <LoadingDots className="text-accent-light" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isCharacterCreateRoute = location.pathname === CHARACTER_CREATE_PATH;

  // Brand-new heroes (or anyone who never finished the creator) must build
  // their character before they can reach any other authenticated screen.
  if (!hasCharacter && !isCharacterCreateRoute) {
    return <Navigate to={CHARACTER_CREATE_PATH} replace />;
  }

  // Heroes who already finished character creation never see it again on a
  // normal login — visiting it directly bounces straight to the dashboard.
  if (hasCharacter && isCharacterCreateRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
