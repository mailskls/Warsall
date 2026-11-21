import { useCallback, useRef, useState } from 'react';
import { Play, Circle } from 'lucide-react';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';
import BetPanel from '@/components/BetPanel';
import GameShell from './GameShell';

interface Props { game: Game; onBack: () => void }

type Phase = 'idle' | 'inflating' | 'result';

// bubble bursts at a random multiplier; win if target <= actual
function genResult(): number {
  const r = Math.random();
  if (r < 0.05) return 1; // instant pop
  return Math.max(1, +(0.97 / (1 - r)).toFixed(2));
}

export default function Bubbles({ game, onBack }: Props) {
  const [amount, setAmount] = useState(10);
  const [target, setTarget] = useState(2);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState(0);
  const [bubble, setBubble] = useState({ scale: 0, mult: 1 });
  const [win, setWin] = useState<boolean | null>(null);
  const raf = useRef<number | null>(null);

  const stop = () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null; };

  const play = useCallback(() => {
    if (phase === 'inflating') return;
    if (!game.placeBet(amount)) return;
    const res = genResult();
    const won = target <= res;
    setPhase('inflating'); setWin(null); setBubble({ scale: 0, mult: 1 });
    sfx.click();

    const startT = performance.now();
    const dur = 1200;
    const animate = () => {
      const t = Math.min(1, (performance.now() - startT) / dur);
      // ease out
      const e = 1 - Math.pow(1 - t, 2);
      const curM = 1 + (res - 1) * e;
      setBubble({ scale: 0.4 + e * 0.6, mult: curM });
      sfx.bubbleTick();
      if (t < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setResult(res); setWin(won); setPhase('result');
        if (won) {
          const pay = +(amount * target).toFixed(2);
          game.payout(pay);
          game.record({ game: 'Bubbles', bet: amount, multiplier: target, payout: pay, win: true });
          sfx.win();
        } else {
          game.record({ game: 'Bubbles', bet: amount, multiplier: 0, payout: 0, win: false });
          sfx.lose();
        }
      }
    };
    raf.current = requestAnimationFrame(animate);
  }, [phase, amount, target, game]);

  const reset = () => { setPhase('idle'); setWin(null); setBubble({ scale: 0, mult: 1 }); setResult(0); };

  const bubbleColor = win === null ? '#3B82F6' : win ? '#22C55E' : '#F43F5E';
  const canPlay = phase !== 'inflating' && amount > 0 && amount <= game.balance && target > 1;

  return (
    <GameShell title="Bubbles" emoji="🫧" onBack={onBack}>
      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <div className="card p-6">
          <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-canvas dot-grid">
            {/* bubble */}
            {(phase === 'inflating' || phase === 'result') && (
              <div
                className="relative grid place-items-center rounded-full transition-none"
                style={{
                  width: 180, height: 180,
                  transform: `scale(${bubble.scale})`,
                  background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), ${bubbleColor}40 50%, ${bubbleColor}80 100%)`,
                  boxShadow: `0 0 40px ${bubbleColor}55, inset 0 0 30px rgba(255,255,255,0.4)`,
                  border: `2px solid ${bubbleColor}`,
                }}
              >
                <div className="absolute left-5 top-4 h-6 w-10 rounded-full bg-white/40 blur-sm" />
                <span className="font-mono text-3xl font-extrabold" style={{ color: bubbleColor }}>
                  {bubble.mult.toFixed(2)}×
                </span>
              </div>
            )}
            {phase === 'idle' && (
              <div className="flex flex-col items-center gap-2 text-ink-400">
                <Circle className="h-12 w-12" />
                <span className="text-sm">Установите цель и нажмите «Играть»</span>
              </div>
            )}
            {phase === 'result' && (
              <div className={`absolute bottom-4 rounded-xl px-4 py-2 font-semibold text-sm animate-pop-in ${
                win ? 'bg-brand-50 text-brand-600' : 'bg-rose-50 text-rose-500'
              }`}>
                {win ? `Победа! ${game.fmt(+(amount * target).toFixed(2))} монет` : `Лопнул на ${result.toFixed(2)}× — проигрыш`}
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[1.5, 2, 3, 5, 10].map((t) => (
              <button key={t} disabled={phase === 'inflating'}
                onClick={() => { setTarget(t); setWin(null); sfx.click(); }}
                className={`rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${
                  target === t ? 'bg-brand-600 text-white' : 'bg-lavender text-ink-700 hover:bg-[#d8dcec]'
                } disabled:opacity-40`}>
                {t.toFixed(2)}×
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <BetPanel amount={amount} setAmount={setAmount} max={game.balance} disabled={phase === 'inflating'}>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">Целевой множитель</label>
              <div className="relative mt-2">
                <input type="number" min="1.01" step="0.1" value={target} disabled={phase === 'inflating'}
                  onChange={(e) => setTarget(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
                  className="input-field pr-8" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">×</span>
              </div>
            </div>
          </BetPanel>

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-ink-400">Шанс</p>
              <p className="font-mono text-lg font-bold text-brand-600">{(97 / target).toFixed(1)}%</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-ink-400">Выплата</p>
              <p className="font-mono text-lg font-bold text-ink-900">{game.fmt(+(amount * target).toFixed(2))}</p>
            </div>
          </div>

          {phase !== 'inflating' ? (
            <button onClick={play} disabled={!canPlay} className="btn-primary w-full">
              <Play className="h-5 w-5" /> Играть
            </button>
          ) : (
            <button disabled className="btn-primary w-full opacity-60">
              Надувается…
            </button>
          )}
          {phase === 'result' && (
            <button onClick={reset} className="btn-secondary w-full">Заново</button>
          )}
          <div className="card p-3 text-xs text-ink-500">
            <p className="font-semibold text-ink-900">Как играть</p>
            <p className="mt-1">Выберите целевой множитель. Пузырь надувается до случайного значения — если дойдёт до вашей цели, вы выиграли.</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
