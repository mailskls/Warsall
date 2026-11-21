import { useCallback, useState } from 'react';
import { Dices, ArrowDown, ArrowUp } from 'lucide-react';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';
import BetPanel from '@/components/BetPanel';
import GameShell from './GameShell';

interface Props { game: Game; onBack: () => void }
type Mode = 'under' | 'over';

export default function Dice({ game, onBack }: Props) {
  const [amount, setAmount] = useState(10);
  const [target, setTarget] = useState(50);
  const [mode, setMode] = useState<Mode>('over');
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [win, setWin] = useState<boolean | null>(null);
  const [display, setDisplay] = useState(50);

  const chance = mode === 'over' ? 100 - target : target;
  const payoutM = +(100 / chance * 0.97).toFixed(4);

  const roll = useCallback(() => {
    if (rolling || !game.placeBet(amount)) return;
    setRolling(true); setWin(null); sfx.click();
    const res = Math.floor(Math.random() * 100) + 1;
    const won = mode === 'over' ? res > target : res < target;
    let f = 0;
    const iv = setInterval(() => {
      setDisplay(Math.floor(Math.random() * 100) + 1);
      sfx.rollTick();
      if (++f >= 16) {
        clearInterval(iv);
        setDisplay(res); setResult(res); setWin(won); setRolling(false);
        if (won) {
          const pay = +(amount * payoutM).toFixed(2);
          game.payout(pay);
          game.record({ game: 'Dice', bet: amount, multiplier: payoutM, payout: pay, win: true });
          sfx.win();
        } else {
          game.record({ game: 'Dice', bet: amount, multiplier: 0, payout: 0, win: false });
          sfx.lose();
        }
      }
    }, 55);
  }, [rolling, amount, mode, target, payoutM, game]);

  const switchMode = (m: Mode) => { if (!rolling) { setMode(m); setWin(null); setResult(null); sfx.click(); } };

  const color = win === null ? '#2563EB' : win ? '#2563EB' : '#F43F5E';
  const fill: React.CSSProperties = mode === 'over'
    ? { left: `${target}%`, right: 0, background: 'linear-gradient(90deg, rgba(37,99,235,0.15), rgba(37,99,235,0.35))' }
    : { left: 0, right: `${100 - target}%`, background: 'linear-gradient(90deg, rgba(37,99,235,0.35), rgba(37,99,235,0.15))' };

  return (
    <GameShell title="Dice" emoji="🎲" onBack={onBack}>
      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <div className="card p-6">
          <div className="mb-6 text-center">
            <div className="font-mono text-6xl font-extrabold transition-colors" style={{ color }}>
              {display.toFixed(2)}
            </div>
            <div className="mt-1 text-sm font-semibold uppercase tracking-wider text-ink-400">
              {rolling ? 'Крутится…' : result !== null ? (win ? 'Победа!' : 'Проигрыш') : 'Готов'}
            </div>
          </div>

          <div className="relative px-2">
            <div className="relative h-3 rounded-full bg-lavender">
              <div className="absolute inset-y-0 rounded-full" style={fill} />
              {result !== null && !rolling && (
                <div className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: `${result}%` }}>
                  <div className="h-7 w-1.5 rounded-full" style={{ background: color }} />
                </div>
              )}
              <div className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2" style={{ left: `${target}%` }}>
                <div className="h-6 w-6 rounded-lg border-2 border-brand-600 bg-white shadow" />
              </div>
            </div>
            <input type="range" min={2} max={98} value={target} disabled={rolling}
              onChange={(e) => { setTarget(parseInt(e.target.value)); setWin(null); setResult(null); }}
              className="absolute inset-x-2 top-1/2 h-3 -translate-y-1/2 cursor-pointer opacity-0"
              style={{ width: 'calc(100% - 16px)' }} />
            <div className="mt-3 flex justify-between font-mono text-xs text-ink-400">
              <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            <button onClick={() => switchMode('under')} disabled={rolling}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                mode === 'under' ? 'bg-brand-600 text-white' : 'bg-lavender text-ink-700 hover:bg-[#d8dcec]'
              } disabled:opacity-40`}>
              <ArrowDown className="h-4 w-4" /> Меньше {target}
            </button>
            <button onClick={() => switchMode('over')} disabled={rolling}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                mode === 'over' ? 'bg-brand-600 text-white' : 'bg-lavender text-ink-700 hover:bg-[#d8dcec]'
              } disabled:opacity-40`}>
              <ArrowUp className="h-4 w-4" /> Больше {target}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <BetPanel amount={amount} setAmount={setAmount} max={game.balance} disabled={rolling} />
          <div className="grid grid-cols-2 gap-2">
            <div className="card p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-ink-400">Шанс</p>
              <p className="font-mono text-lg font-bold text-brand-600">{chance.toFixed(2)}%</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-ink-400">Множитель</p>
              <p className="font-mono text-lg font-bold text-ink-900">{payoutM.toFixed(2)}×</p>
            </div>
          </div>
          <button onClick={roll} disabled={rolling || amount <= 0 || amount > game.balance} className="btn-primary w-full">
            <Dices className="h-5 w-5" /> {rolling ? 'Крутится…' : 'Бросить кубик'}
          </button>
          <div className="card p-3 text-xs text-ink-500">
            <p className="font-semibold text-ink-900">Как играть</p>
            <p className="mt-1">Выберите «Меньше» или «Больше», настройте цель и бросайте. Меньше шанс — больше множитель.</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
