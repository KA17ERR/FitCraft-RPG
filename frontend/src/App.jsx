import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import RPGWorldBackground from "./components/RPGWorldBackground";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CharacterCreate from "./pages/CharacterCreate";
import StyleGuide from "./pages/StyleGuide";
import Workout from "./pages/Workout";
import Nutrition from "./pages/Nutrition";
import Water from "./pages/Water";
import Progress from "./pages/Progress";
import Shop from "./pages/Shop";

// Route patterns for every screen that lives behind auth and should render
// on top of the shared RPGWorldBackground (Dashboard, Workout, Nutrition,
// Water, Progress, Character, Shop, and — once it exists — Emotes). This is
// the ONE place to touch when a new authenticated screen is added: no
// per-page background wiring needed, since RPGWorldBackground is mounted
// once below, at this app-level layout, rather than inside any page.
const AUTHENTICATED_APP_PATHS = [
  "/dashboard",
  "/character/create",
  "/workout",
  "/nutrition",
  "/water",
  "/progress",
  "/shop",
  // "/emotes" — add once an Emotes screen exists; it'll pick up the world
  // background automatically, with zero changes to RPGWorldBackground.
];

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  // Authenticated heroes skip straight to their dashboard; everyone else
  // lands on the public marketing page.
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

export default function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Rendered once, here — outside the AnimatePresence/Routes tree below —
  // so it stays mounted continuously while navigating between authenticated
  // pages. AnimatePresence remounts its keyed Routes child on every
  // navigation to drive the page-transition effect; RPGWorldBackground sits
  // above that in the tree, so it never resets or re-animates in alongside
  // the page itself. This is what makes it the global app/layout-level
  // background rather than a per-page one.
  const showWorldBackground =
    isAuthenticated && AUTHENTICATED_APP_PATHS.some((path) => matchPath(path, location.pathname));

  return (
    <>
      {showWorldBackground && <RPGWorldBackground />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <RootRedirect />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransition>
                <Signup />
              </PageTransition>
            }
          />
          <Route
            path="/styleguide"
            element={
              <PageTransition>
                <StyleGuide />
              </PageTransition>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/character/create"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CharacterCreate />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Workout />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Nutrition />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/water"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Water />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Progress />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Shop />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
