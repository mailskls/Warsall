import { useState } from 'react';
import { Minus, Coins, Check } from 'lucide-react';
import Modal from './Modal';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';

interface Props {
  open: boolean;
  onClose: () => void;
  game: Game;
}

export default function WithdrawModal({ open, onClose, game }: Props) {
  const [amount, setAmount] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    const v = parseFloat(amount);
    if (v > 0 && v <= game.balance) {
      game.placeBet(v); // deduct
      sfx.win();
      setDone(true);
      setTimeout(() => { setDone(false); setAmount(''); onClose(); }, 1800);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Вывести монеты" icon={<Minus className="h-5 w-5 text-brand-600" />}>
      {done ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center animate-pop-in">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Check className="h-8 w-8" />
          </div>
          <p className="font-semibold text-ink-900">Заявка создана!</p>
          <p className="text-sm text-ink-500">В демо-режиме вывод виртуальных монет недоступен.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-ink-500">Демо-вывод: монеты будут списаны с баланса для имитации заявки.</p>
          <div className="mt-4">
            <label className="text-xs font-medium text-ink-500">Сумма вывода</label>
            <div className="relative mt-1.5">
              <input
                type="number" min="1" max={game.balance} value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                className="input-field pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">монет</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-lavender px-3 py-2 text-sm">
            <span className="text-ink-500">Доступно</span>
            <span className="flex items-center gap-1.5 font-mono font-bold text-ink-900">
              <Coins className="h-4 w-4 text-gold-500" /> {game.fmt(game.balance)}
            </span>
          </div>
          <button onClick={submit} disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > game.balance} className="btn-primary mt-4 w-full">
            Создать заявку
          </button>
        </>
      )}
    </Modal>
  );
}
