import { TextReveal } from "../../components/ui/text-reveal";

export default function TextRevealHero() {
  return (
    <div className="relative flex pt-32 pb-8 items-center justify-center px-6">
      <TextReveal
        as="h1"
        className="font-display max-w-2xl text-center font-bold text-4xl text-white tracking-tight sm:text-5xl"
        per="word"
        preset="fade-in-blur"
        speedReveal={0.5}
      >
        Build Support That Moves With Your Server
      </TextReveal>
    </div>
  );
}
