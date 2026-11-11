import { useEffect, useState } from "react";
import { MotionConfig, motion } from "motion/react";
import { Slash } from "lucide-react";
import "@fontsource-variable/manrope";
import youtubeIcon from "@/assets/youtubeIcon.png";
import facebookIcon from "@/assets/facebookIcon.png";
import { restrictionStorage } from "../lib/storage/restriction";

type Key = "youtube" | "facebook";
type State = Record<Key, boolean>;

const PLATFORMS: {
  key: Key;
  name: string;
  target: string;
  host: string;
  icon: string;
}[] = [
  {
    key: "youtube",
    name: "YouTube",
    target: "Shorts",
    host: "youtube.com",
    icon: youtubeIcon,
  },
  {
    key: "facebook",
    name: "Facebook",
    target: "Reels",
    host: "facebook.com",
    icon: facebookIcon,
  },
];

const Switch = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1E29] ${
      checked ? "bg-emerald-300" : "bg-[#2E3242]"
    }`}
  >
    <motion.span
      layout
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className={`absolute top-1 size-5 rounded-full shadow-sm ${
        checked ? "left-6 bg-[#12141C]" : "left-1 bg-[#8B91A5]"
      }`}
    />
  </button>
);

const App = () => {
  const [state, setState] = useState<State>({
    youtube: false,
    facebook: false,
  });

  useEffect(() => {
    restrictionStorage.getValue().then(setState);
  }, []);

  const toggle = async (key: Key, host: string) => {
    const next = !state[key];
    setState((s) => ({ ...s, [key]: next }));

    const current = await restrictionStorage.getValue();
    await restrictionStorage.setValue({ ...current, [key]: next });

    // Reload the active tab so the change applies right away.
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab?.id && tab.url?.includes(host)) {
      await browser.tabs.reload(tab.id);
    }
  };

  const activeCount = Object.values(state).filter(Boolean).length;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="w-72 bg-[#12141C] p-4 text-[#EDEFF5]"
        style={{ fontFamily: "'Manrope Variable', system-ui, sans-serif" }}
      >
        {/* Header */}
        <header className="flex justify-center items-center gap-3 px-1 pb-4">
          <div className="relative flex h-10 w-6 items-center justify-center rounded-[7px] border-2 border-emerald-300">
            <Slash
              className="size-5 -rotate-12 text-emerald-300"
              strokeWidth={2.5}
            />
          </div>
          <div className="flex flex-col leading-tight">
            <h1 className="text-[17px] font-extrabold tracking-tight">
              No Need Shorts
            </h1>
            <p className="text-xs font-medium text-[#8B91A5]">
              {activeCount === 0
                ? "Nothing blocked right now"
                : `Blocking on ${activeCount} of ${PLATFORMS.length} sites`}
            </p>
          </div>
        </header>

        {/* Platforms */}
        <ul className="flex flex-col gap-2.5">
          {PLATFORMS.map((p) => {
            const on = state[p.key];
            return (
              <li
                key={p.key}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors duration-200 ${
                  on
                    ? "border-emerald-300/30 bg-[#1B1E29]"
                    : "border-[#2A2E3C] bg-[#171A23]"
                }`}
              >
                <img
                  src={p.icon}
                  alt=""
                  className={`size-11 shrink-0 rounded-xl object-contain transition-all duration-300 ${
                    on ? "" : "opacity-60 grayscale"
                  }`}
                />
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-[15px] font-bold">{p.name}</p>
                  <p
                    className={`text-xs font-medium transition-colors duration-200 ${
                      on ? "text-emerald-300" : "text-[#8B91A5]"
                    }`}
                  >
                    {on ? `${p.target} blocked` : `${p.target} allowed`}
                  </p>
                </div>
                <Switch
                  checked={on}
                  onChange={() => toggle(p.key, p.host)}
                  label={`Block ${p.target} on ${p.name}`}
                />
              </li>
            );
          })}
        </ul>

        <p className="px-1 pt-3.5 text-[11px] leading-snug text-[#6B7186]">
          The tab you're on reloads when you change a setting.
        </p>
      </div>
    </MotionConfig>
  );
};

export default App;
