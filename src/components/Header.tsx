import { Menu, Plus, Coins, MessageCircle, Volume2, VolumeX } from 'lucide-react';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';

interface Props {
  game: Game;
  soundOn: boolean;
  onToggleSound: () => void;
  onOpenDrawer: () => void;
  onTopUp: () => void;
  onChat: () => void;
}

export default function Header({ game, soundOn, onToggleSound, onOpenDrawer, onTopUp, onChat }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-lavender/60 bg-canvas/85 px-3 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button onClick={onOpenDrawer} className="grid h-9 w-9 place-items-center rounded-xl text-ink-700 transition-colors hover:bg-lavender">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-sm">
            <span className="text-lg">🔥</span>
          </div>
          <span className="font-extrabold tracking-tight text-ink-900">NEXUS</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-card">
          <Coins className="h-4 w-4 text-gold-500" />
          <span className="font-mono text-sm font-bold text-ink-900 tabular-nums">{game.fmt(game.balance)}</span>
          <button
            onClick={onTopUp}
            className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white transition-transform hover:scale-110 active:scale-95"
            aria-label="Пополнить"
          >
            <Plus className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
        <button
          onClick={onToggleSound}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white text-ink-700 shadow-card transition-colors hover:bg-lavender"
          aria-label={soundOn ? 'Выключить звук' : 'Включить звук'}
          title={soundOn ? 'Выключить звук' : 'Включить звук'}
        >
          {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        <button
          onClick={onChat}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white text-ink-700 shadow-card transition-colors hover:bg-lavender"
          aria-label="Чат"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
