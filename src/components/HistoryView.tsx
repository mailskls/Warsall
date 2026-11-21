import { Bomb, Rocket, Dices, Circle } from 'lucide-react';
import type { BetRecord, Game } from '@/store/gameStore';

interface Props { game: Game }

const ICONS: Record<string, typeof Bomb> = {
  Mines: Bomb, Crash: Rocket, Dice: Dices, Bubbles: Circle,
};

export default function HistoryView({ game }: Props) {
  return (
    <div className="card p-4 animate-slide-up">
      <h2 className="mb-3 font-bold text-ink-900">История игр</h2>
      {game.history.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-400">Ставок пока нет — сыграйте первую игру!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400">
                <th className="pb-2 font-medium">Игра</th>
                <th className="pb-2 text-right font-medium">Ставка</th>
                <th className="pb-2 text-right font-medium">Множ.</th>
                <th className="pb-2 text-right font-medium">Выплата</th>
              </tr>
            </thead>
            <tbody>
              {game.history.map((b: BetRecord) => {
                const Icon = ICONS[b.game] ?? Circle;
                return (
                  <tr key={b.id} className="border-t border-lavender/60">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${b.win ? 'text-brand-600' : 'text-ink-400'}`} />
                        <span className="font-medium text-ink-900">{b.game}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono text-ink-700">{game.fmt(b.bet)}</td>
                    <td className="py-2.5 text-right font-mono">
                      <span className={b.win ? 'text-brand-600' : 'text-ink-400'}>{b.multiplier.toFixed(2)}×</span>
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold">
                      <span className={b.win ? 'text-brand-600' : 'text-rose-500'}>
                        {b.win ? '+' : '−'}{game.fmt(b.win ? b.payout : b.bet)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
