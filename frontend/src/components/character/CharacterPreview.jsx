import { motion } from "framer-motion";
import { findOption, BODY_TYPES, SKIN_TONES, HAIR_COLORS, OUTFITS } from "../../utils/characterOptions";

const CANVAS_W = 120;
const CANVAS_H = 168;
const CENTER_X = CANVAS_W / 2;

const DEFAULT_BODY = BODY_TYPES[1];
const DEFAULT_SKIN = SKIN_TONES[1].hex;
const DEFAULT_HAIR = HAIR_COLORS[0].hex;
const DEFAULT_OUTFIT = OUTFITS[0];

/**
 * CharacterPreview — a live, entirely original pixel-art sprite built from
 * plain SVG rects (no imported artwork/assets of any kind). Every part is
 * derived from the customization data so it updates instantly as the hero
 * picks options in Step 3.
 */
export default function CharacterPreview({ data, className = "" }) {
  const body = findOption(BODY_TYPES, data.bodyType) || DEFAULT_BODY;
  const skinHex = findOption(SKIN_TONES, data.skinTone)?.hex || DEFAULT_SKIN;
  const hairHex = findOption(HAIR_COLORS, data.hairColor)?.hex || DEFAULT_HAIR;
  const outfit = findOption(OUTFITS, data.outfit) || DEFAULT_OUTFIT;
  const hairstyle = data.hairstyle || "short";
  const accessories = data.accessories || [];
  const hasAccessory = (a) => accessories.includes(a);

  // ---- layout, derived from body type -----------------------------------
  const headSize = 32;
  const headX = CENTER_X - headSize / 2;
  const headY = 8;

  const torsoW = body.torsoWidth;
  const torsoX = CENTER_X - torsoW / 2;
  const torsoY = headY + headSize + 6;
  const torsoH = 50;

  const armW = body.armWidth;
  const armH = 46;
  const armY = torsoY + 2;
  // Flush against the torso's sides (no horizontal gap) so the shoulder
  // seam is a straight joint instead of a floating rectangle.
  const leftArmX = torsoX - armW;
  const rightArmX = torsoX + torsoW;

  const legGap = 4;
  const legW = (torsoW - legGap) / 2;
  const legH = 54;
  const legY = torsoY + torsoH;
  const leftLegX = torsoX;
  const rightLegX = torsoX + legW + legGap;

  const footH = 8;
  const footY = legY + legH;

  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      <svg
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        className="h-full w-full"
        role="img"
        aria-label="Character preview"
      >
        {/* cape (rendered first so it sits behind the torso/arms) */}
        {hasAccessory("cape") && (
          <rect
            x={torsoX - 8}
            y={torsoY - 2}
            width={torsoW + 16}
            height={torsoH + 34}
            fill={outfit.secondary}
            opacity="0.9"
          />
        )}

        {/* ponytail (behind the head) */}
        {hairstyle === "ponytail" && (
          <rect x={headX + headSize - 2} y={headY + 10} width={8} height={26} fill={hairHex} />
        )}

        {/* legs */}
        <rect x={leftLegX} y={legY} width={legW} height={legH} fill={outfit.secondary} />
        <rect x={rightLegX} y={legY} width={legW} height={legH} fill={outfit.secondary} />

        {/* feet */}
        <rect x={leftLegX - 1} y={footY} width={legW + 2} height={footH} fill="#20242f" />
        <rect x={rightLegX - 1} y={footY} width={legW + 2} height={footH} fill="#20242f" />

        {/* arms (skin) */}
        <rect x={leftArmX} y={armY} width={armW} height={armH} fill={skinHex} />
        <rect x={rightArmX} y={armY} width={armW} height={armH} fill={skinHex} />

        {/* sleeves (outfit accent over the top of each arm) */}
        <rect x={leftArmX} y={armY} width={armW} height={16} fill={outfit.secondary} />
        <rect x={rightArmX} y={armY} width={armW} height={16} fill={outfit.secondary} />

        {/* gloves */}
        {hasAccessory("gloves") && (
          <>
            <rect x={leftArmX - 1} y={armY + armH - 12} width={armW + 2} height={12} fill={outfit.primary} />
            <rect x={rightArmX - 1} y={armY + armH - 12} width={armW + 2} height={12} fill={outfit.primary} />
          </>
        )}

        {/* torso */}
        <rect x={torsoX} y={torsoY} width={torsoW} height={torsoH} fill={outfit.primary} />
        {/* torso center trim */}
        <rect x={CENTER_X - 2} y={torsoY} width={4} height={torsoH} fill={outfit.secondary} />

        {/* neck */}
        <rect x={CENTER_X - 6} y={headY + headSize - 2} width={12} height={8} fill={skinHex} />

        {/* head */}
        <rect x={headX} y={headY} width={headSize} height={headSize} fill={skinHex} />

        {/* hairstyle */}
        {hairstyle === "short" && <rect x={headX - 1} y={headY - 4} width={headSize + 2} height={12} fill={hairHex} />}
        {hairstyle === "long" && (
          <>
            <rect x={headX - 1} y={headY - 4} width={headSize + 2} height={12} fill={hairHex} />
            <rect x={headX - 3} y={headY + 6} width={7} height={32} fill={hairHex} />
            <rect x={headX + headSize - 4} y={headY + 6} width={7} height={32} fill={hairHex} />
          </>
        )}
        {hairstyle === "mohawk" && (
          <>
            <rect x={headX - 1} y={headY - 2} width={headSize + 2} height={6} fill={hairHex} />
            <rect x={CENTER_X - 5} y={headY - 14} width={10} height={16} fill={hairHex} />
          </>
        )}
        {hairstyle === "ponytail" && <rect x={headX - 1} y={headY - 4} width={headSize + 2} height={12} fill={hairHex} />}

        {/* glasses */}
        {hasAccessory("glasses") && (
          <>
            <rect x={headX + 5} y={headY + 15} width={9} height={6} fill="#20242f" />
            <rect x={headX + headSize - 14} y={headY + 15} width={9} height={6} fill="#20242f" />
            <rect x={headX + 14} y={headY + 17} width={4} height={2} fill="#20242f" />
          </>
        )}

        {/* headband */}
        {hasAccessory("headband") && (
          <rect x={headX - 1} y={headY + 9} width={headSize + 2} height={5} fill="#ffd166" />
        )}
      </svg>
    </motion.div>
  );
}
