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
            className="space-y-8 max-w-5xl mx-auto pb-12"
        >
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[22px] font-semibold text-white tracking-tight">
                            Embed Customization
                        </h2>
                    </div>
                    <p className="text-[14px] text-slate-400 max-w-lg leading-relaxed">
                        Personalize the look of the Cyron Assistant embed in your server. Choose a color that matches your brand identity.
                    </p>
                </div>
                {isProOrBusiness && (
                    <button
                        onClick={handleSaveEmbedColor}
                        disabled={updateGuildPending || guildLoading}
                        className="shrink-0 rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
                    >
                        {updateGuildPending ? 'Saving…' : 'Save Changes'}
                    </button>
                )}
            </div>

            {/* Upgrade banner */}
            {!isProOrBusiness && (
                <div className="flex flex-col gap-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 text-[13px] sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-semibold text-amber-500 flex items-center gap-2">
                            <span className="text-lg">🔒</span> Pro / Business Feature
                        </p>
                        <p className="mt-1 text-amber-500/80">Upgrade to customize embed colors.</p>
                    </div>
                    <button className="w-full sm:w-auto rounded-full bg-amber-500 px-5 py-2 text-[13px] font-medium text-amber-950 hover:bg-amber-400 transition-colors">
                        Upgrade plan
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden p-8">
                {guildLoading ? (
                    <div className="space-y-6">
                        <SkeletonLine w="w-1/4" h="h-5" />
                        <SkeletonLine w="w-full" h="h-10" />
                        <SkeletonLine w="w-1/3" h="h-8" />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex-1 space-y-8">
                            <div>
                                <label className="block text-[14px] font-medium text-white mb-4">Color Hex Code</label>
                                <div className="flex items-center gap-3">
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border border-white/10 shadow-sm" style={{ backgroundColor: embedColor }}>
                                        <input
                                            type="color"
                                            value={embedColor}
                                            onChange={(e) => setEmbedColor(e.target.value)}
                                            className="absolute -inset-2 w-[200%] h-[200%] cursor-pointer opacity-0"
                                            disabled={!isProOrBusiness}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={embedColor}
                                        onChange={(e) => setEmbedColor(e.target.value)}
                                        className="w-full max-w-[160px] rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-[13px] text-white outline-none focus:border-white/20 focus:bg-white/10 transition-all disabled:opacity-50"
                                        placeholder="#1ab7ef"
                                        disabled={!isProOrBusiness}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[14px] font-medium text-white mb-4">Suggested Swatches</label>
                                <div className="flex flex-wrap gap-3">
                                    {EMBED_SWATCHES.map((hex) => (
                                        <button
                                            key={hex}
                                            type="button"
                                            onClick={() => isProOrBusiness && setEmbedColor(hex)}
                                            disabled={!isProOrBusiness}
                                            className="relative h-10 w-10 rounded-full border border-white/10 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/20 shadow-sm disabled:hover:scale-100 disabled:opacity-50"
                                            style={{ backgroundColor: hex }}
                                            title={hex}
                                        >
                                            {embedColor.toLowerCase() === hex.toLowerCase() && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="h-2 w-2 rounded-full bg-white shadow-sm" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-[14px] font-medium text-white mb-4">Live Preview</label>
                            <div
                                className="rounded-xl border border-white/5 bg-white/[0.02] p-6 shadow-inner transition-colors duration-300 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 bottom-0 left-0 w-1 transition-colors duration-300" style={{ backgroundColor: embedColor }} />
                                <div className="pl-2">
                                    <p className="text-[15px] font-semibold text-white flex items-center gap-2">
                                        Cyron Assistant
                                        <span className="text-[10px] uppercase font-bold text-white/50 bg-white/5 px-1.5 py-0.5 rounded">Bot</span>
                                    </p>
                                    <p className="mt-2 text-[14px] text-slate-300 leading-relaxed">
                                        Ticket #123 · Opened by User
                                    </p>
                                    <p className="mt-3 text-[13px] text-slate-400">
                                        Use this channel to get AI-powered support and manage your requests.
                                    </p>
                                    <div className="mt-4 text-[11px] font-mono text-slate-500 opacity-60">
                                        Color applies to all ticket embeds
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}