import { useCallback, useEffect, useRef, useState } from 'react';
export { sfx } from './sound';

export type GameId = 'mines' | 'crash' | 'dice' | 'bubbles';

export interface BetRecord {
  id: string;
  game: string;
  bet: number;
  multiplier: number;
  payout: number;
  win: boolean;
  ts: number;
}

export interface SimWin {
  id: string;
  player: string;
  game: string;
  amount: number;
  multiplier: number;
  ts: number;
}

const START = 1000;
let counter = 0;
const uid = () => `r${Date.now()}_${counter++}`;

const SIM_PLAYERS = [
  'Алексей', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Ольга',
  'Иван', 'Екатерина', 'Никита', 'Виктория', 'Павел', 'Дарья',
];
const SIM_GAMES = ['Mines', 'Crash', 'Dice', 'Bubbles'];

function simWin(): SimWin {
  const win = Math.random() < 0.6;
  const mult = win ? +(Math.random() * 8 + 1.1).toFixed(2) : +(Math.random() * 0.9 + 0.1).toFixed(2);
  const bet = +(Math.random() * 200 + 20).toFixed(2);
  return {
    id: uid(),
    player: SIM_PLAYERS[Math.floor(Math.random() * SIM_PLAYERS.length)],
    game: SIM_GAMES[Math.floor(Math.random() * SIM_GAMES.length)],
    amount: +(bet * mult).toFixed(2),
    multiplier: mult,
    ts: Date.now(),
  };
}

export function useGame() {
  const [balance, setBalance] = useState(START);
  const [history, setHistory] = useState<BetRecord[]>([]);
  const [simWins, setSimWins] = useState<SimWin[]>(() => Array.from({ length: 10 }, simWin));
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const balRef = useRef(balance);
  balRef.current = balance;

  useEffect(() => {
    const iv = setInterval(() => setSimWins((p) => [simWin(), ...p].slice(0, 16)), 4000);
    return () => clearInterval(iv);
  }, []);

  const fmt = useCallback((n: number) => {
    const s = n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return s;
  }, []);

  const canBet = useCallback((a: number) => a > 0 && a <= balRef.current, []);
  const placeBet = useCallback((a: number): boolean => {
    if (a <= 0 || a > balRef.current) return false;
    setBalance((b) => +(b - a).toFixed(2));
    return true;
  }, []);
  const payout = useCallback((a: number) => setBalance((b) => +(b + a).toFixed(2)), []);
  const refill = useCallback((a: number) => setBalance((b) => +(b + a).toFixed(2)), []);
  const claimBonus = useCallback((): boolean => {
    if (bonusClaimed) return false;
    setBalance((b) => +(b + 500).toFixed(2));
    setBonusClaimed(true);
    return true;
  }, [bonusClaimed]);
  const record = useCallback((r: Omit<BetRecord, 'id' | 'ts'>) => {
    setHistory((h) => [{ ...r, id: uid(), ts: Date.now() }, ...h].slice(0, 60));
  }, []);

  return {
    balance, fmt, canBet, placeBet, payout, refill, claimBonus,
    history, record, simWins, bonusClaimed,
  };
}

export type Game = ReturnType<typeof useGame>;
