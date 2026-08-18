import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from "../../components/ui/Loader";
import { useApp } from "../../context/AppContext";
import { TextBlurIn } from '../../components/ui/text-blur-in';

export const UsageTab = ({
    usage, usageLoading, usageError,
    historyLoading, historyError,
    logsLoading, logsError,
    chartData, recentActivity,
}: {
    usage: any; usageLoading: boolean; usageError: boolean;
    historyLoading: boolean; historyError: boolean;
    logsLoading: boolean; logsError: boolean;
    chartData: any[]; recentActivity: any[];
}) => {
    const { theme } = useApp();
    const isDark = theme === 'dark';

    return (
        <motion.div key="usage" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-4">
            <div>
                <TextBlurIn className="text-white font-bold uppercase text-[2.5rem] md:text-[3.5rem] leading-[0.85] tracking-tighter" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>Usage Analytics</TextBlurIn>
                <TextBlurIn delay={0.2} className="text-[14px] text-slate-400 mt-1">Monitor your server's token usage and ticket automation limits.</TextBlurIn>
            </div>


            {(usageLoading || historyLoading || logsLoading) && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <div className="mb-4 flex items-center gap-2 text-[14px] text-slate-400"><Loader /> Loading usage…</div>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />)}
                    </div>
                </div>
            )}

            {(usageError || historyError || logsError) && (
                <p className="text-sm text-red-500">Failed to load usage analytics. Please refresh.</p>
            )}

            {usage && !usageLoading && !usageError && (
                <>
                    {/* Stats grid — 1 col mobile, 3 col sm+ */}
                    <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                        {[
                            { label: 'Monthly tokens', used: usage.monthly_tokens_used, limit: usage.monthly_tokens_limit },
                            { label: 'Tickets today', used: usage.daily_ticket_count, limit: usage.daily_ticket_limit },
                            { label: 'Concurrent sessions', used: usage.concurrent_ai_sessions, limit: usage.concurrent_limit },
                        ].map(({ label, used, limit }, i) => (
                            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
                                <p className="mt-2 text-2xl font-bold text-[#0433FF]">
                                    {(used || 0).toLocaleString()} <span className="text-[15px] font-semibold text-slate-400">/ {(limit || 0).toLocaleString()}</span>
                                </p>
                                <div className="mt-4 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((used || 0) / (limit || 1)) * 100)}%` }}
                                        transition={{ duration: 0.4 }} className="h-full rounded-full bg-[#0433FF]" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Chart */}
                    <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <p className="mb-1 text-[15px] font-bold text-white">Token usage (last 7 days)</p>
                        <p className="mb-4 text-[13px] text-slate-400">Daily token usage from live logs.</p>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0433FF" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#0433FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} stroke="rgba(255,255,255,0.1)" />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="rgba(255,255,255,0.1)" />
                                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, backgroundColor: '#0f0f0f', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                        formatter={(v) => [(typeof v === 'number' ? v : Number(v ?? 0)).toLocaleString(), 'Tokens']} />
                                    <Area type="monotone" dataKey="tokens" stroke="#0433FF" strokeWidth={2} fill="url(#tg)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Recent activity — card list on mobile, table on sm+ */}
                    <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                        <p className="mb-4 text-[15px] font-bold text-white">Recent activity</p>

                        {/* Mobile cards */}
                        <div className="space-y-3 sm:hidden">
                            {recentActivity.map((row) => (
                                <div key={row.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-[13px]">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-[#0433FF]">{row.tokens} tokens</span>
                                        <span className="text-slate-500">{new Date(row.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                    <p className="mt-2 text-slate-300 leading-relaxed">{row.preview}</p>
                                </div>
                            ))}
                        </div>

                        {/* Desktop table */}
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-left text-[14px]">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/5">
                                        <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Time</th>
                                        <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Tokens</th>
                                        <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Preview</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentActivity.map((row) => (
                                        <tr key={row.id} className="transition-colors hover:bg-white/5">
                                            <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{new Date(row.timestamp).toLocaleString()}</td>
                                            <td className="px-4 py-3 font-mono font-bold text-[#0433FF]">{row.tokens}</td>
                                            <td className="px-4 py-3 text-slate-200 max-w-[200px] truncate">{row.preview}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </motion.div>
    );
}
