import { Bomb, Rocket, Dices, Circle, Gift, Users, Trophy, History, MessageCircle, HelpCircle, Zap, Coins, ArrowRight, Sparkles } from 'lucide-react';
import type { Game, GameId } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';

interface Props {
  game: Game;
  onPlay: (id: GameId) => void;
  onOpenBonus: () => void;
  onEvent: (kind: 'referrals' | 'giveaways' | 'support' | 'faq' | 'soon', detail?: string) => void;
}

const PLAYABLE = [
  { id: 'mines' as GameId, name: 'Mines', desc: 'Найдите алмазы', icon: Bomb, color: 'from-brand-400 to-brand-600' },
  { id: 'crash' as GameId, name: 'Crash', desc: 'Летите до краша', icon: Rocket, color: 'from-brand-400 to-brand-600' },
  { id: 'dice' as GameId, name: 'Dice', desc: 'Больше или меньше', icon: Dices, color: 'from-brand-400 to-brand-600' },
  { id: 'bubbles' as GameId, name: 'Bubbles', desc: 'Надуйте пузырь', icon: Circle, color: 'from-brand-400 to-brand-600' },
];

const COMING = [
  { name: 'Jackpot', emoji: '🎰' }, { name: 'Slots', emoji: '🍒' },
  { name: 'X50', emoji: '⚡' }, { name: 'Keno', emoji: '🔢' },
];

const MENU = [
  { label: 'Бонусы', icon: Gift, action: 'bonus' as const },
  { label: 'Рефералы', icon: Users, action: 'referrals' as const },
  { label: 'Розыгрыши', icon: Trophy, action: 'giveaways' as const },
  { label: 'История', icon: History, action: 'history' as const },
  { label: 'Поддержка', icon: MessageCircle, action: 'support' as const },
  { label: 'FAQ', icon: HelpCircle, action: 'faq' as const },
];

export default function Lobby({ game, onPlay, onOpenBonus, onEvent }: Props) {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Hero */}
      <div className="card relative overflow-hidden p-5 sm:p-6">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-100/60 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-gold-500/10 blur-2xl" />
        <div className="relative">
          <div className="chip bg-brand-50 text-brand-600">
            <Sparkles className="h-3.5 w-3.5" /> Демо-режим · Виртуальные монеты
          </div>
          <h1 className="mt-2 font-extrabold text-2xl text-ink-900">Добро пожаловать в NEXUS</h1>
          <p className="mt-1 text-sm text-ink-500">
            Играйте в мини-игры на виртуальные монеты. Стартовый баланс: {game.fmt(1000)} монет.
          </p>
          <div className="mt-4 flex gap-2">
            <button onClick={() => { sfx.click(); onPlay('crash'); }} className="btn-primary !py-2.5 text-sm">
              <Rocket className="h-4 w-4" /> Играть в Crash
            </button>
            {!game.bonusClaimed && (
              <button onClick={() => { sfx.click(); onOpenBonus(); }} className="btn-secondary !py-2.5 text-sm">
                <Gift className="h-4 w-4" /> Бонус +500
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Balance strip */}
      <div className="card flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500/15 text-gold-600">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-ink-500">Ваш баланс</p>
            <p className="font-mono text-lg font-bold text-ink-900">{game.fmt(game.balance)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-lavender px-3 py-1.5 text-center">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Ставок</p>
            <p className="font-mono text-sm font-bold text-ink-900">{game.history.length}</p>
          </div>
          <div className="rounded-xl bg-lavender px-3 py-1.5 text-center">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Побед</p>
            <p className="font-mono text-sm font-bold text-brand-600">{game.history.filter((b) => b.win).length}</p>
          </div>
        </div>
      </div>

      {/* Games */}
      <div className="section-divider"><span>Игры</span></div>
      <div className="grid grid-cols-2 gap-3">
        {PLAYABLE.map((g) => (
          <button
            key={g.id}
            onClick={() => { sfx.click(); onPlay(g.id); }}
            className="card card-hover group flex flex-col items-start gap-3 p-4 text-left"
          >
            <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${g.color} text-white shadow-pop`}>
              <g.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-ink-900">{g.name}</p>
              <p className="text-xs text-ink-500">{g.desc}</p>
            </div>
            <span className="mt-auto flex items-center gap-1 text-xs font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
              Играть <ArrowRight className="h-3 w-3" />
            </span>
          </button>
        ))}
      </div>

      {/* Coming soon */}
      <div className="grid grid-cols-4 gap-2.5">
        {COMING.map((c) => (
          <button
            key={c.name}
            onClick={() => { sfx.click(); onEvent('soon', c.name); }}
            className="card card-hover flex flex-col items-center gap-1 p-3 opacity-80"
          >
            <span className="text-2xl">{c.emoji}</span>
            <span className="text-xs font-medium text-ink-700">{c.name}</span>
            <span className="text-[9px] text-ink-400">Скоро</span>
          </button>
        ))}
      </div>

      {/* Menu */}
      <div className="section-divider"><span>Меню</span></div>
      <div className="grid grid-cols-3 gap-3">
        {MENU.map((m) => (
          <button
            key={m.label}
            onClick={() => {
              sfx.click();
              if (m.action === 'bonus') onOpenBonus();
              else if (m.action === 'history') window.dispatchEvent(new CustomEvent('open-history'));
              else onEvent(m.action);
            }}
            className="card card-hover flex flex-col items-center gap-2 p-4"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <m.icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-ink-900">{m.label}</span>
          </button>
        ))}
      </div>

      <p className="pt-2 text-center text-xs text-ink-400">
        Демо-прототип · Виртуальные монеты · 18+
      </p>
    </div>
  );
}
