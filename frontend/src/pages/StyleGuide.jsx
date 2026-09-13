import { useState } from "react";
import PixelCard from "../components/PixelCard";
import PixelButton from "../components/PixelButton";
import PixelInput from "../components/PixelInput";
import XPBar from "../components/XPBar";
import StatCard from "../components/StatCard";
import QuestCard from "../components/QuestCard";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import LevelUpModal from "../components/LevelUpModal";
import LoadingDots from "../components/LoadingDots";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useToast } from "../context/ToastContext";
import {
  CoinIcon,
  HeartIcon,
  ShieldIcon,
  SwordIcon,
  FlameIcon,
  StarIcon,
  QuestIcon,
} from "../components/icons/PixelIcons";

function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2 className="pixel-text-shadow mb-4 border-b-4 border-border pb-2 font-heading text-sm text-accent-light">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function StyleGuide() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [celebrateDemo, setCelebrateDemo] = useState(false);

  function handleLoadingDemo() {
    setIsButtonLoading(true);
    setTimeout(() => setIsButtonLoading(false), 1600);
  }

  function handleCelebrateDemo() {
    setCelebrateDemo(true);
    setTimeout(() => setCelebrateDemo(false), 1400);
  }

  return (
    <div className="min-h-screen bg-ink px-4 py-10 text-[#fffffe] pixel-scanlines">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="font-heading text-[10px] uppercase tracking-widest text-muted">FitCraft RPG</p>
          <h1 className="pixel-text-shadow mt-2 font-heading text-2xl text-accent">Design System</h1>
          <p className="mt-2 text-base text-muted">
            Reusable pixel-RPG components — buttons, cards, bars, badges, toasts, and modals.
          </p>
        </header>

        <Section title="Typography">
          <PixelCard>
            <p className="font-heading text-2xl text-[#fffffe]">Heading XL</p>
            <p className="mt-3 font-heading text-base text-[#fffffe]">Heading MD — Press Start 2P</p>
            <p className="mt-3 font-heading text-xs uppercase tracking-widest text-muted">Heading Label</p>
            <p className="mt-3 text-lg text-[#fffffe]">Body text — VT323, easy to read at length.</p>
            <p className="mt-1 text-base text-muted">Muted / secondary body text.</p>
          </PixelCard>
        </Section>

        <Section title="Buttons — PixelButton">
          <PixelCard>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PixelButton variant="primary">Primary</PixelButton>
              <PixelButton variant="secondary">Secondary</PixelButton>
              <PixelButton variant="gold" icon={<CoinIcon size={16} />}>
                Claim
              </PixelButton>
              <PixelButton variant="ghost">Ghost</PixelButton>
              <PixelButton variant="primary" size="sm" fullWidth={false}>
                Small
              </PixelButton>
              <PixelButton variant="primary" size="lg" fullWidth={false}>
                Large
              </PixelButton>
              <PixelButton variant="primary" disabled>
                Disabled
              </PixelButton>
              <PixelButton variant="primary" loading={isButtonLoading} onClick={handleLoadingDemo}>
                {isButtonLoading ? "Loading..." : "Click to Load"}
              </PixelButton>
            </div>
          </PixelCard>
        </Section>

        <Section title="Loading — LoadingDots">
          <PixelCard>
            <div className="flex flex-wrap items-center gap-6 text-accent-light">
              <LoadingDots size="sm" />
              <LoadingDots size="md" />
              <span className="text-muted">Used inside buttons and full-screen loading states.</span>
            </div>
          </PixelCard>
        </Section>

        <Section title="Inputs — PixelInput">
          <PixelCard className="max-w-md">
            <div className="space-y-4">
              <PixelInput label="Hero Name" placeholder="e.g. IronKnight42" />
              <PixelInput label="Email" type="email" placeholder="you@example.com" />
            </div>
          </PixelCard>
        </Section>

        <Section title="XP / Level — XPBar">
          <PixelCard>
            <div className="space-y-6">
              <XPBar level={4} currentXP={65} xpToNextLevel={100} />
              <XPBar level={12} percent={30} />
            </div>
          </PixelCard>
        </Section>

        <Section title="Stats — StatCard">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={<SwordIcon size={20} />} label="Strength" value="24" accent="accent" />
            <StatCard icon={<ShieldIcon size={20} />} label="Defense" value="18" accent="xp" />
            <StatCard icon={<FlameIcon size={20} />} label="Streak" value="7 days" sublabel="Personal best!" accent="gold" />
            <StatCard icon={<HeartIcon size={20} />} label="HP" value="90 / 100" accent="hp" />
          </div>
        </Section>

        <Section title="Badges — Badge">
          <PixelCard>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="accent" icon={<SwordIcon size={12} />}>
                Hard
              </Badge>
              <Badge variant="gold" icon={<StarIcon size={12} />}>
                Epic
              </Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="danger">Overdue</Badge>
              <Badge variant="xp">Lv. 12</Badge>
            </div>
          </PixelCard>
        </Section>

        <Section title="Quests — QuestCard">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <QuestCard
              title="Morning Jog"
              description="Run 3km before 9 AM to earn the early-bird bonus."
              difficulty="easy"
              xpReward={30}
              coinReward={10}
              status="active"
              onAction={() => showToast({ title: "Quest Started", description: "Morning Jog", type: "success" })}
            />
            <QuestCard
              title="Dragon's Deadlift"
              description="Hit a new deadlift PR in today's session."
              difficulty="epic"
              xpReward={120}
              coinReward={50}
              status="completed"
            />
            <QuestCard
              title="Iron Gauntlet"
              description="Unlocks at Level 15."
              difficulty="hard"
              xpReward={80}
              coinReward={25}
              status="locked"
            />
          </div>
          <PixelCard className="mt-4 max-w-xs">
            <p className="mb-3 text-sm text-muted">Quest completion animation (glow + floating rewards):</p>
            <PixelButton size="sm" variant="secondary" onClick={handleCelebrateDemo}>
              Trigger Celebration
            </PixelButton>
            <div className="mt-4">
              <QuestCard
                title="Demo Quest"
                description="Watch the rewards float up."
                difficulty="medium"
                xpReward={40}
                coinReward={15}
                status="active"
                celebrate={celebrateDemo}
                onAction={handleCelebrateDemo}
              />
            </div>
          </PixelCard>
        </Section>

        <Section title="Empty & Error States">
          <div className="grid gap-4 md:grid-cols-2">
            <EmptyState
              icon={<QuestIcon size={22} />}
              title="No Quests Yet"
              description="New quests roll in each morning. Check back soon, hero."
            />
            <ErrorState
              title="Couldn't Load Quests"
              description="Something interrupted the connection to the guild board."
              onRetry={() => showToast({ title: "Retrying...", type: "default" })}
            />
          </div>
        </Section>

        <Section title="Toasts">
          <PixelCard>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <PixelButton
                size="sm"
                variant="secondary"
                onClick={() => showToast({ title: "+50 XP", description: "Quest reward", type: "xp" })}
              >
                XP Toast
              </PixelButton>
              <PixelButton
                size="sm"
                variant="gold"
                onClick={() => showToast({ title: "+25 Coins", description: "Quest reward", type: "coin" })}
              >
                Coin Toast
              </PixelButton>
              <PixelButton
                size="sm"
                variant="secondary"
                onClick={() => showToast({ title: "Quest Complete!", type: "success" })}
              >
                Success Toast
              </PixelButton>
              <PixelButton
                size="sm"
                variant="ghost"
                onClick={() => showToast({ title: "HP Low", description: "Rest before your next quest", type: "hp" })}
              >
                HP Toast
              </PixelButton>
            </div>
          </PixelCard>
        </Section>

        <Section title="Modal">
          <PixelCard className="max-w-xs">
            <PixelButton onClick={() => setIsModalOpen(true)}>Open Modal</PixelButton>
          </PixelCard>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Quest Details">
            <p className="text-base text-muted">
              A standard dialog for quest details, confirmations, or forms.
            </p>
            <div className="mt-4">
              <PixelButton onClick={() => setIsModalOpen(false)}>Got it</PixelButton>
            </div>
          </Modal>
        </Section>

        <Section title="Level-Up Celebration — LevelUpModal">
          <PixelCard className="max-w-xs">
            <PixelButton variant="gold" onClick={() => setIsLevelUpOpen(true)}>
              Trigger Level Up
            </PixelButton>
          </PixelCard>
          <LevelUpModal
            isOpen={isLevelUpOpen}
            onClose={() => setIsLevelUpOpen(false)}
            level={5}
            description="New quests and gear have been unlocked."
          />
        </Section>
      </div>
    </div>
  );
}
