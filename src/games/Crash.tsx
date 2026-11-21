import { useCallback, useEffect, useRef, useState } from 'react';
import { Rocket, TrendingUp } from 'lucide-react';
import type { Game } from '@/store/gameStore';
import { sfx } from '@/store/gameStore';
import BetPanel from '@/components/BetPanel';
import GameShell from './GameShell';

interface Props { game: Game; onBack: () => void }

type Phase = 'idle' | 'running' | 'crashed' | 'cashed';

function genCrash(): number {
  const r = Math.random();
  if (r < 0.03) return 1;
  return Math.max(1, +(0.99 / (1 - r)).toFixed(2));
}

const HIST_LEN = 12;
const W = 360, H = 240, PAD = 8;

export default function Crash({ game, onBack }: Props) {
  const [amount, setAmount] = useState(10);
  const [auto, setAuto] = useState(2);
  const [phase, setPhase] = useState<Phase>('idle');
  const [mult, setMult] = useState(1);
  const [crashAt, setCrashAt] = useState(1);
  const [hasBet, setHasBet] = useState(false);
  const [hist, setHist] = useState<number[]>([]);
  const [path, setPath] = useState('M0,240');
  const [pt, setPt] = useState({ x: 0, y: H });

  const raf = useRef<number | null>(null);
  const startT = useRef(0);
  const crashRef = useRef(0);
  const cashedRef = useRef(false);
  const hasBetRef = useRef(false);
  const autoRef = useRef(auto); autoRef.current = auto;
  const amtRef = useRef(amount); amtRef.current = amount;

  const stop = useCallback(() => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = null; }, []);

  const endRound = useCallback((crashed: number) => {
    stop();
    if (hasBetRef.current && !cashedRef.current) {
      game.record({ game: 'Crash', bet: amtRef.current, multiplier: crashed, payout: 0, win: false });
      sfx.crash();
    }
    setHasBet(false); hasBetRef.current = false;
    setPhase('crashed');
    setHist((h) => [crashed, ...h].slice(0, HIST_LEN));
    setTimeout(() => {
      setPhase('idle'); setMult(1); setPath('M0,240'); setPt({ x: 0, y: H });
    }, 2000);
  }, [game, stop]);

  const tick = useCallback(() => {
    const t = (performance.now() - startT.current) / 1000;
    const m = +Math.pow(Math.E, 0.16 * t * Math.sqrt(t + 0.5)).toFixed(2);
    const crash = crashRef.current;
    if (m >= crash) { setMult(crash); endRound(crash); return; }
    setMult(m);
    const tt = Math.min(1, Math.log(m) / Math.log(30));
    const x = tt * (W - PAD * 2);
    const y = H - PAD - tt * (H - PAD * 2);
    setPt({ x, y });
    setPath((p) => {
      const last = p.trim().split(' ').pop() || '0,240';
      const [lx, ly] = last.split(',').map(Number);
      if (Math.abs(x - lx) < 2 && Math.abs(ly - y) < 2) return p;
      return `${p} L${x.toFixed(1)},${y.toFixed(1)}`;
    });
    if (hasBetRef.current && !cashedRef.current && autoRef.current > 1 && m >= autoRef.current) {
      cashedRef.current = true;
      const pay = +(amtRef.current * m).toFixed(2);
      game.payout(pay);
      game.record({ game: 'Crash', bet: amtRef.current, multiplier: m, payout: pay, win: true });
      sfx.cashout();
      setHasBet(false); hasBetRef.current = false;
      setPhase('cashed');
    }
    if (Math.random() < 0.22) sfx.crashTick(Math.floor(m * 3));
    raf.current = requestAnimationFrame(tick);
  }, [endRound, game]);

  const startRound = useCallback(() => {
    crashRef.current = genCrash();
    cashedRef.current = false;
    startT.current = performance.now();
    setMult(1); setPath('M0,240'); setPt({ x: 0, y: H });
    setPhase('running');
    raf.current = requestAnimationFrame(tick);
  }, [tick]);

  const placeBet = () => {
    if (phase !== 'idle') return;
    if (!game.placeBet(amount)) return;
    setHasBet(true); hasBetRef.current = true; sfx.click();
  };

  const cashOut = () => {
    if (phase !== 'running' || !hasBetRef.current || cashedRef.current) return;
    cashedRef.current = true;
    const pay = +(amtRef.current * mult).toFixed(2);
    game.payout(pay);
    game.record({ game: 'Crash', bet: amtRef.current, multiplier: mult, payout: pay, win: true });
    sfx.cashout();
    setHasBet(false); hasBetRef.current = false;
    setPhase('cashed');
  };

  useEffect(() => () => stop(), [stop]);

  const running = phase === 'running';
  const color = phase === 'crashed' ? '#F43F5E' : (running || phase === 'cashed') ? '#2563EB' : '#94A3B8';

  return (
    <GameShell title="Crash" emoji="🚀" onBack={onBack}>
      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <div className="card p-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {hist.map((h, i) => (
              <span key={i} className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${
                h >= 2 ? 'bg-brand-50 text-brand-600' : h >= 1.4 ? 'bg-gold-500/15 text-gold-600' : 'bg-rose-50 text-rose-500'
              }`}>{h.toFixed(2)}×</span>
            ))}
            {hist.length === 0 && <span className="text-xs text-ink-400">Раундов пока нет</span>}
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-canvas dot-grid">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 240 }}>
              <defs>
                <linearGradient id="crashFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d={`${path} L${pt.x.toFixed(1)},${H} L0,${H} Z`} fill="url(#crashFill)" />
              <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {running && <circle cx={pt.x} cy={pt.y} r="5" fill={color} />}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              {phase === 'idle' && (
                <div className="flex flex-col items-center gap-1 text-ink-400">
                  <Rocket className="h-7 w-7" />
                  <span className="text-sm">Сделайте ставку и запускайте</span>
                </div>
              )}
              {(running || phase === 'cashed') && (
                <div className="text-center">
                  <div className="font-mono text-5xl font-extrabold" style={{ color }}>{mult.toFixed(2)}×</div>
                  {phase === 'cashed' && <div className="mt-1 text-sm font-semibold text-brand-600">Забрано!</div>}
                </div>
              )}
              {phase === 'crashed' && (
                <div className="text-center animate-shake">
                  <div className="font-mono text-5xl font-extrabold text-rose-500">{crashAt.toFixed(2)}×</div>
                  <div className="mt-1 text-sm font-bold uppercase tracking-widest text-rose-500">Краш</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <BetPanel amount={amount} setAmount={setAmount} max={game.balance} disabled={running}>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-500">Авто-вывод</label>
              <div className="relative mt-2">
                <input type="number" min="1.01" step="0.1" value={auto} disabled={running}
                  onChange={(e) => setAuto(Math.max(1.01, parseFloat(e.target.value) || 1.01))}
                  className="input-field pr-8" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">×</span>
              </div>
            </div>
          </BetPanel>

          {!hasBet && phase !== 'running' && (
            <button onClick={placeBet} disabled={amount <= 0 || amount > game.balance} className="btn-primary w-full">
              <Rocket className="h-5 w-5" /> Поставить · {game.fmt(amount)}
            </button>
          )}
          {hasBet && running && (
            <button onClick={cashOut} className="btn-primary w-full animate-pulse-soft">
              <TrendingUp className="h-5 w-5" /> Забрать · {game.fmt(+(amount * mult).toFixed(2))}
            </button>
          )}
          {!hasBet && running && (
            <div className="card px-4 py-3 text-center text-sm text-ink-500">Раунд идёт…</div>
          )}
          <div className="card p-3 text-xs text-ink-500">
            <p className="font-semibold text-ink-900">Как играть</p>
            <p className="mt-1">Поставьте ставку и заберите выигрыш до краша. Чем дольше летит ракета — тем больше множитель.</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
