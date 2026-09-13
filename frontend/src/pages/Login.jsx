import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PixelCard from "../components/PixelCard";
import PixelInput from "../components/PixelInput";
import PixelButton from "../components/PixelButton";
import Badge from "../components/Badge";
import { ShieldIcon, StarIcon, EyeIcon, EyeOffIcon, HeartIcon } from "../components/icons/PixelIcons";
import { validateEmail, validateLoginPassword } from "../utils/validation";

function validateForm(values) {
  return {
    email: validateEmail(values.email),
    password: validateLoginPassword(values.password),
  };
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field) {
    return (e) => {
      const value = e.target.value;
      const nextForm = { ...form, [field]: value };
      setForm(nextForm);
      if (touched[field]) {
        setErrors((prev) => ({ ...prev, [field]: validateForm(nextForm)[field] }));
      }
    };
  }

  function handleBlur(field) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateForm(form)[field] }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fieldErrors = validateForm(form);
    setErrors(fieldErrors);
    setTouched({ email: true, password: true });
    if (fieldErrors.email || fieldErrors.password) return;

    setServerError("");
    setIsSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-12">
      {/* backdrop grid glow, matches the landing page hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(62,207,95,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(62,207,95,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at 50% 30%, black, transparent 75%)",
        }}
      />

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-6 flex justify-center"
        >
          <Link to="/" className="flex items-center gap-2">
            <span className="pixel-corners-sm flex h-9 w-9 items-center justify-center border-2 border-accent-light bg-accent/20">
              <StarIcon size={20} />
            </span>
            <span className="font-heading text-xs uppercase tracking-widest text-[#fffffe]">
              FitCraft <span className="text-accent-light">RPG</span>
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <PixelCard variant="accent" className="pixel-scanlines">
            <div className="mb-6 text-center">
              <Badge variant="xp" size="sm" icon={<ShieldIcon size={12} />} className="mb-3">
                Hero Login
              </Badge>
              <h1 className="pixel-text-shadow font-heading text-xl uppercase text-[#fffffe] sm:text-2xl">
                Enter Your Realm
              </h1>
              <p className="mt-2 text-base text-muted">Continue your quest where you left off.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <PixelInput
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={updateField("email")}
                onBlur={handleBlur("email")}
                error={touched.email ? errors.email : ""}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <PixelInput
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={updateField("password")}
                onBlur={handleBlur("password")}
                error={touched.password ? errors.password : ""}
                placeholder="Your password"
                autoComplete="current-password"
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-muted transition-colors hover:text-accent-light"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </button>
                }
              />

              <AnimatePresence>
                {serverError && (
                  <motion.p
                    key="server-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    role="alert"
                    className="pixel-corners-sm flex items-center gap-2 border-2 border-hp bg-hp/10 px-3 py-2 text-sm text-hp"
                  >
                    <HeartIcon size={14} />
                    {serverError}
                  </motion.p>
                )}
              </AnimatePresence>

              <PixelButton type="submit" loading={isSubmitting}>
                {isSubmitting ? "Entering Realm..." : "Login"}
              </PixelButton>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              New to FitCraft?{" "}
              <Link to="/signup" className="text-accent-light hover:underline">
                Create your hero
              </Link>
            </p>
          </PixelCard>
        </motion.div>
      </div>
    </div>
  );
}
