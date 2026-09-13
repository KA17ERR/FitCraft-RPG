import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PixelCard from "../components/PixelCard";
import PixelButton from "../components/PixelButton";
import Badge from "../components/Badge";
import HeroScene from "../components/icons/HeroScene";
import {
  DumbbellIcon,
  AppleIcon,
  WaterDropIcon,
  ChartIcon,
  QuestIcon,
  CheckIcon,
  XPIcon,
  LevelUpIcon,
  StarIcon,
} from "../components/icons/PixelIcons";

const HOW_IT_WORKS = [
  {
    icon: QuestIcon,
    title: "Create",
    description: "Build your hero and set the quests that match your real-world fitness goals.",
  },
  {
    icon: CheckIcon,
    title: "Complete Quests",
    description: "Finish workouts, log meals and hit water goals to clear daily & weekly quests.",
  },
  {
    icon: XPIcon,
    title: "Gain XP",
    description: "Every rep, sip and healthy choice earns experience points toward your next level.",
  },
  {
    icon: LevelUpIcon,
    title: "Level Up",
    description: "Watch your character grow stronger as your real habits become second nature.",
  },
];

const FEATURES = [
  {
    icon: DumbbellIcon,
    title: "Workout Quests",
    description: "Turn every training session into a quest with XP rewards and streak bonuses.",
    accent: "accent",
  },
  {
    icon: AppleIcon,
    title: "Nutrition Tracking",
    description: "Log meals as loot and keep your hero fueled with balanced, trackable nutrition.",
    accent: "gold",
  },
  {
    icon: WaterDropIcon,
    title: "Water Goals",
    description: "Hydration quests keep your mana bar full — hit your daily water target to level up faster.",
    accent: "xp",
  },
  {
    icon: ChartIcon,
    title: "Progress Stats",
    description: "Character sheets and stat panels track your real growth, quest by quest.",
    accent: "success",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-[#fffffe]">
      {/* ---------------------------------------------------------------- */}
      {/* Navbar                                                           */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b-4 border-border bg-ink/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-center gap-2">
            <span className="pixel-corners-sm flex h-8 w-8 items-center justify-center border-2 border-accent-light bg-accent/20">
              <StarIcon size={18} />
            </span>
            <span className="font-heading text-xs uppercase tracking-widest text-[#fffffe] sm:text-sm">
              FitCraft <span className="text-accent-light">RPG</span>
            </span>
          </a>

          <div className="hidden items-center gap-6 font-heading text-[10px] uppercase tracking-widest text-muted md:flex">
            <a href="#features" className="transition-colors hover:text-accent-light">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-accent-light">
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-2">
            <PixelButton
              variant="ghost"
              size="sm"
              fullWidth={false}
              onClick={() => navigate("/login")}
            >
              Login
            </PixelButton>
            <PixelButton
              variant="primary"
              size="sm"
              fullWidth={false}
              onClick={() => navigate("/signup")}
              className="hidden sm:inline-block"
            >
              Start Journey
            </PixelButton>
          </div>
        </nav>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section id="top" className="pixel-scanlines relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
        {/* backdrop grid glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(62,207,95,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(62,207,95,0.07) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at 50% 0%, black, transparent 75%)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <Badge variant="xp" size="md" icon={<StarIcon size={12} />} className="mb-5">
              Level Up Your Real Life
            </Badge>

            <h1 className="pixel-text-shadow font-heading text-2xl leading-snug sm:text-3xl md:text-4xl">
              Your Fitness Journey.
              <br />
              <span className="text-accent-light">Your Character.</span>
              <br />
              <span className="text-xp">Your RPG.</span>
            </h1>

            <p className="mt-5 max-w-md text-lg text-muted sm:text-xl">
              Every workout, meal and glass of water fuels your hero. Complete quests, earn XP
              and watch your character — and your real-life fitness — level up together.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PixelButton
                variant="primary"
                size="lg"
                fullWidth={false}
                onClick={() => navigate("/signup")}
              >
                Start Journey
              </PixelButton>
              <PixelButton
                variant="secondary"
                size="lg"
                fullWidth={false}
                onClick={() => navigate("/login")}
              >
                Login
              </PixelButton>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { label: "Active Heroes", value: "10,000+" },
                { label: "Quest Types", value: "50+" },
                { label: "Avg. Levels/Mo", value: "8" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-lg text-accent-light">{stat.value}</p>
                  <p className="font-heading text-[9px] uppercase tracking-widest text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="relative mx-auto w-full max-w-sm lg:max-w-none"
          >
            <PixelCard variant="accent" className="p-6 sm:p-8">
              <HeroScene className="w-full" />
            </PixelCard>
            <motion.div
              className="absolute -right-3 -top-3 sm:-right-6 sm:-top-6"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Badge variant="gold" size="md" icon={<StarIcon size={12} />}>
                +50 XP
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How It Works                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section id="how-it-works" className="border-t-4 border-border bg-panel/40 px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <p className="font-heading text-[10px] uppercase tracking-widest text-xp">
              The Quest Loop
            </p>
            <h2 className="pixel-text-shadow mt-2 font-heading text-xl sm:text-2xl">How It Works</h2>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-10 hidden h-1 bg-border lg:block"
            />
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                  className="relative"
                >
                  <PixelCard className="h-full text-center" interactive>
                    <div className="mx-auto -mt-9 mb-3 flex h-14 w-14 items-center justify-center border-4 border-accent bg-ink pixel-corners-sm">
                      <Icon size={26} />
                    </div>
                    <Badge variant="xp" size="sm" className="mb-2">
                      Step {i + 1}
                    </Badge>
                    <h3 className="font-heading text-sm uppercase tracking-wide text-[#fffffe]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-base text-muted">{step.description}</p>
                  </PixelCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Feature cards                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section id="features" className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="mb-12 text-center"
          >
            <p className="font-heading text-[10px] uppercase tracking-widest text-accent-light">
              Character Stats
            </p>
            <h2 className="pixel-text-shadow mt-2 font-heading text-xl sm:text-2xl">
              Everything Your Hero Needs
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                >
                  <PixelCard className="h-full" interactive>
                    <div className="flex h-12 w-12 items-center justify-center border-2 border-border bg-ink pixel-corners-sm">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-4 font-heading text-sm uppercase tracking-wide text-[#fffffe]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-muted">{feature.description}</p>
                  </PixelCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Final CTA                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t-4 border-border px-4 py-16 sm:px-6 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="mx-auto max-w-3xl"
        >
          <PixelCard variant="accent" className="pixel-scanlines text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border-4 border-gold bg-ink pixel-corners-sm">
              <LevelUpIcon size={28} />
            </div>
            <h2 className="pixel-text-shadow font-heading text-xl sm:text-2xl">
              Ready to Begin Your Quest?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-lg text-muted">
              Create your hero in under a minute and turn your next workout into your first
              completed quest.
            </p>
            <div className="mx-auto mt-7 flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <PixelButton
                variant="primary"
                size="lg"
                fullWidth={false}
                onClick={() => navigate("/signup")}
              >
                Start Journey
              </PixelButton>
              <PixelButton
                variant="ghost"
                size="lg"
                fullWidth={false}
                onClick={() => navigate("/login")}
              >
                I already have a hero
              </PixelButton>
            </div>
          </PixelCard>
        </motion.div>
      </section>

      <footer className="border-t-4 border-border px-4 py-8 text-center sm:px-6">
        <p className="font-heading text-[9px] uppercase tracking-widest text-muted">
          FitCraft RPG — Your Fitness Journey. Your Character. Your RPG.
        </p>
      </footer>
    </div>
  );
}
