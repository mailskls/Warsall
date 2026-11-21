import { Gift, Check, Coins } from 'lucide-react';
import Modal from './Modal';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';

interface Props {
  open: boolean;
  onClose: () => void;
  game: Game;
}

export default function BonusModal({ open, onClose, game }: Props) {
  const claim = () => {
    if (game.claimBonus()) {
      sfx.coins();
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Ежедневный бонус" icon={<Gift className="h-5 w-5 text-gold-500" />}>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 text-white shadow-pop">
          <Gift className="h-10 w-10" />
        </div>
        <p className="font-bold text-ink-900">+500 бесплатных монет</p>
        <p className="text-sm text-ink-500">Заберите свой ежедневный демо-бонус. Доступно один раз за сессию.</p>

        {game.bonusClaimed ? (
          <div className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-50 py-3 font-semibold text-brand-600">
            <Check className="h-5 w-5" /> Бонус уже получен
          </div>
        ) : (
          <button onClick={claim} className="btn-primary mt-2 w-full animate-pulse-soft">
            <Coins className="h-5 w-5" /> Забрать бонус
          </button>
        )}
      </div>
    </Modal>
  );
}
