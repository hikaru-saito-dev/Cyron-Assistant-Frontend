type Channel = { id: string; name: string };

type Props = {
  channels: Channel[];
  value: string;
  onChange: (channelId: string, channelName: string) => void;
  placeholder?: string;
  allowEmpty?: boolean;
};

export function ChannelPicker({
  channels,
  value,
  onChange,
  placeholder = "Select a channel…",
  allowEmpty = true,
}: Props) {
  const exists = !value || channels.some((c) => c.id === value);

  return (
    <div>
      <select
        className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-3 py-2.5 font-sans text-sm text-white transition-all focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
        value={value}
        onChange={(e) => {
          const id = e.target.value;
          const ch = channels.find((c) => c.id === id);
          onChange(id, ch?.name || "");
        }}
      >
        {allowEmpty && <option value="">{placeholder}</option>}
        {channels.map((c) => (
          <option key={c.id} value={c.id}>
            #{c.name}
          </option>
        ))}
      </select>
      {value && !exists && (
        <p className="mt-1 font-sans text-[11px] font-medium text-yellow-400">
          Channel no longer exists
        </p>
      )}
    </div>
  );
}
