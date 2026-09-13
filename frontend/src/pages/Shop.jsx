import ComingSoonScreen from "../components/ComingSoonScreen";
import { ShopIcon } from "../components/icons/PixelIcons";

export default function Shop() {
  return (
    <ComingSoonScreen
      icon={<ShopIcon size={28} />}
      title="Shop"
      description="Spend coins on gear, cosmetics, and boosts once the shop opens. Keep earning coins by completing quests on the Dashboard."
    />
  );
}
