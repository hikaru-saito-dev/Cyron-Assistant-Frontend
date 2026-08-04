import { TextReveal } from "../../components/ui/text-reveal";

export default function TextRevealHero() {
  return (
    <div className="flex pt-32 pb-4 items-center justify-center px-6">
      <TextReveal
        as="h1"
        className="max-w-2xl text-center font-bold text-4xl text-foreground tracking-tight sm:text-5xl dark:text-white"
        per="word"
        preset="fade-in-blur"
        speedReveal={0.5}
      >
        Build Support That Moves With Your Server
      </TextReveal>
    </div>
  );
}
