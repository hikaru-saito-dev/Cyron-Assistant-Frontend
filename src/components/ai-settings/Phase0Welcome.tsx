import { FaRobot, FaSearch } from "react-icons/fa";

type Phase0WelcomeProps = {
  onAnalyze: () => void;
  onSkip: () => void;
};

export function Phase0Welcome({ onAnalyze, onSkip }: Phase0WelcomeProps) {
  return (
    <div className="mx-auto max-w-xl py-8 text-center sm:py-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10 text-amber-300 backdrop-blur-xl">
        <FaRobot className="text-2xl" />
      </div>

      <h2 className="font-display text-2xl font-bold tracking-tight text-white">
        Configure AI for your server
      </h2>

      <p className="mt-4 font-sans text-sm leading-relaxed text-zinc-400">
        Let&apos;s configure the AI for your server. First I&apos;ll take a
        look at how it&apos;s built — channels, roles and panels — so I only ask
        you the necessary questions.
      </p>
      <p className="mt-3 font-sans text-xs leading-relaxed text-zinc-500">
        Privacy: the initial scan only looks at structure (names and panels),
        not private message content. Transcript reading is optional and always
        asks for your consent later.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onAnalyze}
          className="cyron-btn-primary w-full max-w-sm sm:w-auto"
        >
          <FaSearch className="text-xs" />
          Analyze my server
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="font-sans text-sm font-medium text-zinc-400 transition hover:text-amber-400"
        >
          Skip, I&apos;ll fill everything in myself
        </button>
      </div>
    </div>
  );
}
