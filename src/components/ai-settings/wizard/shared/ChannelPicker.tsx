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
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-sans text-sm dark:border-slate-600 dark:bg-slate-800"
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
        <p className="mt-1 font-sans text-[11px] font-medium text-amber-600">
          Channel no longer exists
        </p>
      )}
    </div>
  );
}
