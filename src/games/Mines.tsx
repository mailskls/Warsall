import { useCallback, useState } from 'react';
import { Gem, Bomb, RotateCcw, TrendingUp } from 'lucide-react';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';
import BetPanel from '@/components/BetPanel';
import GameShell from './GameShell';

interface Props { game: Game; onBack: () => void }

const GRID = 25;
type Cell = 'hidden' | 'gem' | 'bomb' | 'safe';

function mult(k: number, m: number): number {
  if (k === 0) return 1;
  let p = 1;
  for (let i = 0; i < k; i++) p *= (GRID - i) / (GRID - m - i);
  return +(p * 0.97).toFixed(4);
}

const MINE_OPTS = [1, 3, 5, 10, 24];

export default function Mines({ game, onBack }: Props) {
  const [amount, setAmount] = useState(10);
  const [mines, setMines] = useState(3);
  const [cells, setCells] = useState<Cell[]>(Array(GRID).fill('hidden'));
  const [bombs, setBombs] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(0);
  const [active, setActive] = useState(false);
  const [ended, setEnded] = useState<'win' | 'lose' | null>(null);

  const curMult = mult(revealed, mines);
  const nextMult = mult(revealed + 1, mines);
  const canCash = active && revealed > 0 && ended === null;

  const start = useCallback(() => {
    if (!game.canBet(amount)) return;
    if (!game.placeBet(amount)) return;
    const pos = new Set<number>();
    while (pos.size < mines) pos.add(Math.floor(Math.random() * GRID));
    setBombs(pos);
    setCells(Array(GRID).fill('hidden'));
    setRevealed(0);
    setEnded(null);
    setActive(true);
    sfx.click();
  }, [amount, mines, game]);

  const reveal = useCallback((idx: number) => {
    if (!active || ended || cells[idx] !== 'hidden') return;
    if (bombs.has(idx)) {
      setCells((p) => p.map((c, i) => {
        if (i === idx) return 'bomb' as Cell;
        if (bombs.has(i)) return 'bomb' as Cell;
        if (c === 'hidden') return 'safe' as Cell;
        return c;
      }));
      sfx.bomb();
      setEnded('lose');
      game.record({ game: 'Mines', bet: amount, multiplier: 0, payout: 0, win: false });
      setActive(false);
    } else {
      setCells((p) => p.map((c, i) => (i === idx ? 'gem' as Cell : c)));
      const nextStep = revealed;
      setRevealed((r) => r + 1);
      sfx.gem(nextStep);
    }
  }, [active, ended, cells, bombs, amount, game]);

  const cashOut = useCallback(() => {
    if (!canCash) return;
    const m = mult(revealed, mines);
    const payoutAmt = +(amount * m).toFixed(2);
    game.payout(payoutAmt);
    game.record({ game: 'Mines', bet: amount, multiplier: m, payout: payoutAmt, win: true });
    sfx.cashout();
    setCells((p) => p.map((c, i) => c === 'hidden' ? (bombs.has(i) ? 'bomb' as Cell : 'safe' as Cell) : c));
    setEnded('win');
    setActive(false);
  }, [canCash, revealed, mines, amount, game, bombs]);

  const reset = () => {
    setCells(Array(GRID).fill('hidden'));
    setBombs(new Set());
    setRevealed(0);
    setEnded(null);
    setActive(false);
  };

  return (
    <GameShell title="Mines" emoji="💣" onBack={onBack}>
      <div className="grid gap-3 lg:grid-cols-[300px_1fr]">
        {/* controls */}
        <div className="space-y-3">
          <BetPanel amount={amount} setAmount={setAmount} max={game.balance} disabled={active}>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">Количество мин</label>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {MINE_OPTS.map((m) => (
                  <button
                    key={m} disabled={active}
                    onClick={() => setMines(m)}
                    className={`rounded-lg py-2 text-sm font-bold transition-all ${
                      mines === m ? 'bg-brand-600 text-white' : 'bg-lavender text-ink-700 hover:bg-[#d8dcec]'
                    } disabled:opacity-40`}
                  >{m}</button>
                ))}
              </div>
              <input type="range" min={1} max={24} value={mines} disabled={active}
                onChange={(e) => setMines(parseInt(e.target.value))}
                className="mt-3 w-full accent-brand-600" />
            </div>
          </BetPanel>

          {!active && ended === null && (
            <button onClick={start} disabled={amount <= 0 || amount > game.balance} className="btn-primary w-full">
              Поставить · {game.fmt(amount)}
            </button>
          )}
          {active && (
            <button onClick={cashOut} disabled={!canCash} className={`btn-primary w-full ${canCash ? 'animate-pulse-soft' : ''}`}>
              <TrendingUp className="h-4 w-4" /> Забрать выигрыш
              <span className="ml-1 text-xs opacity-90">{game.fmt(+(amount * curMult).toFixed(2))} · {curMult.toFixed(2)}×</span>
            </button>
          )}
          {ended && (
            <button onClick={reset} className="btn-secondary w-full">
              <RotateCcw className="h-4 w-4" /> Новая игра
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="card p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-ink-400">Множитель</p>
              <p className="font-mono text-lg font-bold text-brand-600">{curMult.toFixed(2)}×</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-[11px] uppercase tracking-wider text-ink-400">Алмазов</p>
              <p className="font-mono text-lg font-bold text-ink-900">{revealed}/{GRID - mines}</p>
            </div>
          </div>
          {active && (
            <div className="card p-3 text-center text-xs text-ink-500">
              Следующий алмаз: <span className="font-mono font-bold text-brand-600">{nextMult.toFixed(2)}×</span>
            </div>
          )}
        </div>

        {/* grid */}
        <div className="card p-4 sm:p-6">
          {ended === 'win' && (
            <div className="mb-3 rounded-xl bg-brand-50 py-2 text-center font-semibold text-brand-600 animate-pop-in">
              Забрано {curMult.toFixed(2)}× — {game.fmt(+(amount * curMult).toFixed(2))} монет!
            </div>
          )}
          {ended === 'lose' && (
            <div className="mb-3 rounded-xl bg-rose-50 py-2 text-center font-semibold text-rose-600 animate-pop-in">
              Бум! Вы попали на мину. Ставка проиграна.
            </div>
          )}
          <div className="mx-auto grid max-w-md grid-cols-5 gap-2 sm:gap-2.5">
            {cells.map((c, i) => (
              <button
                key={i}
                onClick={() => reveal(i)}
                disabled={!active || c !== 'hidden'}
                className={`relative aspect-square rounded-xl transition-all ${
                  c === 'hidden'
                    ? 'bg-gradient-to-b from-lavender to-[#eef1f8] hover:from-brand-50 hover:to-brand-100 active:scale-95'
                    : c === 'gem'
                    ? 'bg-brand-50 ring-2 ring-brand-200'
                    : c === 'bomb'
                    ? 'bg-rose-50 ring-2 ring-rose-200 animate-shake'
                    : 'bg-lavender/50 opacity-50'
                }`}
              >
                {c === 'gem' && <Gem className="h-1/2 w-1/2 mx-auto text-brand-600 animate-pop-in" style={{ filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.4))' }} />}
                {c === 'bomb' && <Bomb className="h-1/2 w-1/2 mx-auto text-rose-500" />}
                {c === 'safe' && <Gem className="h-1/3 w-1/3 mx-auto text-ink-300" />}
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-ink-400">
            Открывайте плитки и находите алмазы. Каждая находка увеличивает множитель. Попадёте на мину — проиграете.
          </p>
        </div>
      </div>
    </GameShell>
  );
}
