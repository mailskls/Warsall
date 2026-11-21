import { useState } from 'react';
import { Plus, Zap, Gift, Coins } from 'lucide-react';
import Modal from './Modal';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';

interface Props {
  open: boolean;
  onClose: () => void;
  game: Game;
}

const PACKS = [
  { label: 'Старт', amount: 500, icon: Zap },
  { label: 'Хай-роллер', amount: 2500, icon: Gift },
  { label: 'Кит', amount: 10000, icon: Coins },
];

export default function RefillModal({ open, onClose, game }: Props) {
  const [custom, setCustom] = useState('');

  const add = (amt: number) => {
    game.refill(amt);
    sfx.coins();
    onClose();
  };
  const addCustom = () => {
    const v = parseFloat(custom);
    if (v > 0) add(v);
  };

  return (
    <Modal open={open} onClose={onClose} title="Пополнить баланс" icon={<Plus className="h-5 w-5 text-brand-600" />}>
      <p className="text-sm text-ink-500">Добавьте виртуальные монеты — это демо, реальные деньги не используются.</p>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {PACKS.map((p) => (
          <button
            key={p.label}
            onClick={() => add(p.amount)}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-lavender p-3 transition-all hover:border-brand-400 hover:bg-brand-50"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <p.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-ink-700">{p.label}</span>
            <span className="font-mono text-sm font-bold text-brand-600">+{p.amount}</span>
          </button>
        ))}
      </div>
      <div className="mt-4">
        <label className="text-xs font-medium text-ink-500">Своя сумма</label>
        <div className="mt-1.5 flex gap-2">
          <input
            type="number" min="1" value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Введите сумму"
            className="input-field"
          />
          <button onClick={addCustom} className="btn-primary !px-4 !py-2.5">Добавить</button>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-lavender px-3 py-2 text-sm">
        <span className="text-ink-500">Текущий баланс</span>
        <span className="flex items-center gap-1.5 font-mono font-bold text-ink-900">
          <Coins className="h-4 w-4 text-gold-500" /> {game.fmt(game.balance)}
        </span>
      </div>
    </Modal>
  );
}
