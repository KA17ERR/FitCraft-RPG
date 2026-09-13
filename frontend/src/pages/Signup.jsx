import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PixelCard from "../components/PixelCard";
import PixelInput from "../components/PixelInput";
import PixelButton from "../components/PixelButton";
import Badge from "../components/Badge";
import { SwordIcon, StarIcon, EyeIcon, EyeOffIcon, HeartIcon } from "../components/icons/PixelIcons";
import { validateEmail, validatePassword, validateConfirmPassword, validateUsername } from "../utils/validation";

function validateForm(values) {
  return {
    username: validateUsername(values.username),
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: validateConfirmPassword(values.password, values.confirmPassword),
  };
}

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field) {
    return (e) => {
      const value = e.target.value;
      const nextForm = { ...form, [field]: value };
      setForm(nextForm);
      setErrors((prev) => {
        const next = { ...prev };
        if (touched[field]) next[field] = validateForm(nextForm)[field];
        // Password and confirm-password validate against each other, so
        // typing in either field should re-check the pairing once both
        // have been touched.
        if (field === "password" && touched.confirmPassword) {
          next.confirmPassword = validateForm(nextForm).confirmPassword;
        }
        return next;
      });
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
    setTouched({ username: true, email: true, password: true, confirmPassword: true });
    if (Object.values(fieldErrors).some(Boolean)) return;

    setServerError("");
    setIsSubmitting(true);
    try {
      await signup({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
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
            "linear-gradient(rgba(253,224,71,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(253,224,71,0.06) 1px, transparent 1px)",
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
              <Badge variant="xp" size="sm" icon={<SwordIcon size={12} />} className="mb-3">
                New Hero
              </Badge>
              <h1 className="pixel-text-shadow font-heading text-xl uppercase text-[#fffffe] sm:text-2xl">
                Create Your Hero
              </h1>
              <p className="mt-2 text-base text-muted">Your legend begins now.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <PixelInput
                label="Hero Name"
                name="username"
                value={form.username}
                onChange={updateField("username")}
                onBlur={handleBlur("username")}
                error={touched.username ? errors.username : ""}
                placeholder="e.g. IronKnight42"
                autoComplete="username"
                required
              />
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
                placeholder="At least 6 characters"
                autoComplete="new-password"
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
              <PixelInput
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={updateField("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={touched.confirmPassword ? errors.confirmPassword : ""}
                placeholder="Type your password again"
                autoComplete="new-password"
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="text-muted transition-colors hover:text-accent-light"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
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
                {isSubmitting ? "Forging Hero..." : "Create Account"}
              </PixelButton>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Already a hero?{" "}
              <Link to="/login" className="text-accent-light hover:underline">
                Log in
              </Link>
            </p>
          </PixelCard>
        </motion.div>
      </div>
    </div>
  );
}
