import { Coins, X, Plus, Minus, Gift, Zap } from 'lucide-react';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';
import Drawer from './Drawer';

interface Props {
  open: boolean;
  onClose: () => void;
  game: Game;
  onBonus: () => void;
}

export default function NavDrawer({ open, onClose, game, onBonus }: Props) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title="Профиль" width="max-w-sm">
      {/* Profile card */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-xl font-bold text-white shadow-pop">
            А
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink-900">Игрок</span>
              <span className="chip bg-gold-500/15 text-gold-600">VIP</span>
            </div>
            <span className="text-xs text-ink-500">ID: 4827193</span>
          </div>
        </div>
      </div>

      {/* Wallet card */}
      <div className="card mt-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-500">Ваш баланс:</span>
          <div className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-gold-500" />
            <span className="font-mono font-bold text-ink-900">{game.fmt(game.balance)}</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => { sfx.click(); onBonus(); }} className="btn-primary !py-2.5 text-sm">
            <Plus className="h-4 w-4" strokeWidth={3} /> Пополнить
          </button>
          <button onClick={() => { sfx.click(); onClose(); window.dispatchEvent(new CustomEvent('open-withdraw')); }} className="btn-secondary !py-2.5 text-sm">
            <Minus className="h-4 w-4" strokeWidth={3} /> Вывести
          </button>
        </div>
      </div>

      {/* Bonus banner */}
      {!game.bonusClaimed && (
        <button
          onClick={() => { sfx.click(); onBonus(); }}
          className="card mt-3 flex w-full items-center gap-3 p-4 text-left card-hover"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold-500/15 text-gold-600">
            <Gift className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink-900">Ежедневный бонус</p>
            <p className="text-xs text-ink-500">Заберите +500 монет бесплатно</p>
          </div>
          <span className="chip bg-brand-600 text-white">+500</span>
        </button>
      )}

      {/* Menu section */}
      <div className="section-divider"><span>Меню</span></div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Бонусы', icon: Gift, onClick: () => { sfx.click(); onBonus(); } },
          { label: 'Рефералы', icon: Plus, onClick: () => { sfx.click(); window.dispatchEvent(new CustomEvent('open-referrals')); onClose(); } },
          { label: 'Розыгрыши', icon: Zap, onClick: () => { sfx.click(); window.dispatchEvent(new CustomEvent('open-giveaways')); onClose(); } },
          { label: 'История игр', icon: Coins, onClick: () => { sfx.click(); window.dispatchEvent(new CustomEvent('open-history')); onClose(); } },
          { label: 'Поддержка', icon: Gift, onClick: () => { sfx.click(); window.dispatchEvent(new CustomEvent('open-support')); onClose(); } },
          { label: 'FAQ', icon: Plus, onClick: () => { sfx.click(); window.dispatchEvent(new CustomEvent('open-faq')); onClose(); } },
        ].map((m) => (
          <button key={m.label} onClick={m.onClick} className="pill-menu">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <m.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-ink-900">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Games section */}
      <div className="section-divider"><span>Игры</span></div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Mines', emoji: '💣', playable: true, id: 'mines' },
          { label: 'Crash', emoji: '🚀', playable: true, id: 'crash' },
          { label: 'Dice', emoji: '🎲', playable: true, id: 'dice' },
          { label: 'Bubbles', emoji: '🫧', playable: true, id: 'bubbles' },
          { label: 'Jackpot', emoji: '🎰', playable: false, id: 'jackpot' },
          { label: 'Slots', emoji: '🍒', playable: false, id: 'slots' },
          { label: 'X50', emoji: '⚡', playable: false, id: 'x50' },
          { label: 'Keno', emoji: '🔢', playable: false, id: 'keno' },
        ].map((g) => (
          <button
            key={g.label}
            onClick={() => {
              if (g.playable) {
                sfx.click();
                window.dispatchEvent(new CustomEvent('open-game', { detail: g.id }));
                onClose();
              } else {
                sfx.click();
                window.dispatchEvent(new CustomEvent('open-soon', { detail: g.label }));
              }
            }}
            className={`pill-menu ${g.playable ? '' : 'opacity-70'}`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <span className="text-sm font-medium text-ink-900">{g.label}</span>
            {!g.playable && <span className="text-[10px] text-ink-400">Скоро</span>}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-xs text-ink-400">
        Демо-режим · Виртуальные монеты<br />Никаких реальных денег
      </div>
    </Drawer>
  );
}


