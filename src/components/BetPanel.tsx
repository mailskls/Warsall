import { useState, type ReactNode } from 'react';

interface Props {
  amount: number;
  setAmount: (n: number) => void;
  max: number;
  disabled?: boolean;
  children?: ReactNode;
  extra?: ReactNode;
}

const QUICK = [10, 50, 100, 500];

export default function BetPanel({ amount, setAmount, max, disabled, children, extra }: Props) {
  const clamp = (v: number) => Math.max(0, Math.min(max, +v.toFixed(2)));
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">Ставка</label>
        <div className="flex gap-1">
          {[{ l: '½', fn: () => amount / 2 }, { l: '2×', fn: () => amount * 2 }, { l: 'Макс', fn: () => max }].map((b) => (
            <button
              key={b.l}
              disabled={disabled}
              onClick={() => setAmount(clamp(b.fn()))}
              className="rounded-lg bg-lavender px-2 py-0.5 text-[11px] font-bold text-ink-700 transition-colors hover:bg-[#d8dcec] disabled:opacity-40"
            >{b.l}</button>
          ))}
        </div>
      </div>
      <div className="relative mt-2">
        <input
          type="number" min={0} max={max} step="0.01"
          value={amount} disabled={disabled}
          onChange={(e) => setAmount(clamp(parseFloat(e.target.value) || 0))}
          className="input-field pr-14"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">монет</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            disabled={disabled || q > max}
            onClick={() => setAmount(clamp(q))}
            className="flex-1 rounded-lg bg-lavender py-1.5 text-xs font-semibold text-ink-700 hover:bg-[#d8dcec] disabled:opacity-30"
          >{q}</button>
        ))}
      </div>
      {children}
      {extra}
    </div>
  );
}
