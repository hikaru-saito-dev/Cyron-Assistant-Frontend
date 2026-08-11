import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { SkeletonLine } from "../../components/ui/Skeleton";

const EMBED_SWATCHES = ['#1ab7ef', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const EmbedSettingsTab = ({
    embedColor, setEmbedColor, isProOrBusiness,
    updateGuildPending, guildLoading,
    handleSaveEmbedColor,
}: {
    embedColor: string;
    setEmbedColor: (s: string) => void;
    isProOrBusiness: boolean;
    updateGuildPending: boolean;
    guildLoading: boolean;
    handleSaveEmbedColor: () => void;
}) => {
    return (
        <motion.div
            key="embed"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
        >
            {guildLoading && (
                <div className="rounded-xl bg-white p-5 shadow-soft space-y-3">
                    <SkeletonLine w="w-1/4" h="h-5" />
                    <SkeletonLine w="w-full" h="h-10" />
                    <SkeletonLine w="w-1/3" h="h-8" />
                </div>
            )}
            {!isProOrBusiness && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-[13px] text-amber-400"
                >
                    <span className="text-xl">🔒</span>
                    <div>
                        <p className="font-bold text-amber-400">Pro / Business only</p>
                        <p className="mt-1 text-amber-400/80 leading-relaxed">
                            Embed color customization is available on Pro and Business plans.
                        </p>
                    </div>
                </motion.div>
            )}
            <motion.div
                whileHover={{ y: -1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
                <label className="mb-3 block text-[14px] font-bold text-white tracking-tight">Embed color</label>
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="color"
                        value={embedColor}
                        onChange={(e) => setEmbedColor(e.target.value)}
                        className="h-10 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent"
                        disabled={!isProOrBusiness}
                    />
                    <input
                        type="text"
                        value={embedColor}
                        onChange={(e) => setEmbedColor(e.target.value)}
                        className="w-28 rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-[13px] text-white outline-none ring-[#0433FF]/40 focus:border-[#0433FF]/50 focus:ring-2 appearance-none"
                        placeholder="#1ab7ef"
                        disabled={!isProOrBusiness}
                    />
                </div>
                <p className="mt-5 text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Swatches</p>
                <div className="mt-2 flex gap-3">
                    {EMBED_SWATCHES.map((hex) => (
                        <button
                            key={hex}
                            type="button"
                            onClick={() => isProOrBusiness && setEmbedColor(hex)}
                            disabled={!isProOrBusiness}
                            className="h-10 w-10 rounded-xl border border-white/10 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0433FF] shadow-sm"
                            style={{
                                backgroundColor: hex,
                                borderColor: embedColor === hex ? 'transparent' : undefined,
                                boxShadow: embedColor === hex ? `0 0 0 2px #0f0f0f, 0 0 0 4px ${hex}` : undefined,
                            }}
                            title={hex}
                        />
                    ))}
                </div>
                <p className="mt-6 text-[13px] font-semibold text-slate-300">Live preview</p>
                <div
                    className="mt-3 rounded-xl border border-white/10 bg-black/20 p-5 shadow-inner"
                    style={{ borderLeftWidth: '4px', borderLeftColor: embedColor }}
                >
                    <p className="text-[15px] font-bold text-white">Cyron Assistant</p>
                    <p className="mt-1 text-[13px] text-slate-400 leading-relaxed">
                        Ticket #123 · Opened by User · Use this channel to get AI-powered support.
                    </p>
                    <p className="mt-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">Preview — color applies to all ticket embeds.</p>
                </div>
                {isProOrBusiness && (
                    <button
                        type="button"
                        className="mt-6 rounded-xl bg-[#0433FF] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#0433FF]/90 transition-colors shadow-lg shadow-[#0433FF]/20 disabled:opacity-50"
                        onClick={handleSaveEmbedColor}
                        disabled={updateGuildPending || guildLoading}
                    >
                        {updateGuildPending ? 'Saving…' : 'Save color'}
                    </button>
                )}
            </motion.div>
        </motion.div>
    );
}