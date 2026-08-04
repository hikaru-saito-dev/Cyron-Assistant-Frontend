import { Zap, Cpu, Fingerprint, Pencil, Settings2, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FeatureCard } from '../../components/ui/grid-feature-cards';

const features = [
	{
		title: 'AI‑powered ticket replies',
		icon: Zap,
		description: 'Automatically answer repetitive questions with responses based on your own documentation, FAQ, and previous tickets.',
	},
	{
		title: 'Fine‑grained control',
		icon: Cpu,
		description: 'Configure channels, categories, rate limits, and escalation rules per server so the bot fits your existing workflows.',
	},
	{
		title: 'Insightful usage dashboard',
		icon: Fingerprint,
		description: 'Track tickets, token usage, and AI sessions so you always know how much value the bot is delivering.',
	},
	{
		title: 'Setup difficulty of AI',
		icon: Pencil,
		description: 'Smart Wizard and Auto-Discovery',
	},
	{
		title: 'Ticket system',
		icon: Settings2,
		description: 'Excellent and highly customizable',
	},
	{
		title: 'Multi-panel isolation',
		icon: Sparkles,
		description: 'Strong isolation as each panel can have its own AI',
	},
];

export function FeaturesSection() {
	return (
		<section className="py-16 md:py-32">
			<div className="mx-auto w-full max-w-5xl space-y-8 px-4">
				<AnimatedContainer className="mx-auto max-w-3xl text-center">
					<h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold text-slate-900 dark:text-white">
						Power. Speed. Control.
					</h2>
					<p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
						Everything you need to automate Discord support effortlessly.
					</p>
				</AnimatedContainer>

				<AnimatedContainer
					delay={0.4}
					className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3 dark:border-slate-800 dark:divide-slate-800"
				>
					{features.map((feature, i) => (
						<FeatureCard key={i} feature={feature} />
					))}
				</AnimatedContainer>
			</div>
		</section>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: React.ComponentProps<typeof motion.div>['className'];
	children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
