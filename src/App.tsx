import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import NavDrawer from '@/components/NavDrawer';
import RefillModal from '@/components/RefillModal';
import WithdrawModal from '@/components/WithdrawModal';
import BonusModal from '@/components/BonusModal';
import InfoModal from '@/components/InfoModal';
import HistoryView from '@/components/HistoryView';
import Lobby from '@/pages/Lobby';
import Mines from '@/games/Mines';
import Crash from '@/games/Crash';
import Dice from '@/games/Dice';
import Bubbles from '@/games/Bubbles';
import { useGame, sfx, type GameId } from '@/store/gameStore';

type View = 'lobby' | GameId | 'history';

export default function App() {
  const game = useGame();
  const [view, setView] = useState<View>('lobby');
  const [navOpen, setNavOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Unlock the AudioContext on the first user gesture (mobile/Safari).
  useEffect(() => {
    const unlock = () => sfx.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      sfx.setEnabled(next);
      if (next) sfx.unlock();
      return next;
    });
  };
  const [refillOpen, setRefillOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [bonusOpen, setBonusOpen] = useState(false);
  const [info, setInfo] = useState<'referrals' | 'giveaways' | 'support' | 'faq' | 'soon' | null>(null);
  const [infoDetail, setInfoDetail] = useState<string | undefined>();

  // Global custom events from drawer/lobby
  useEffect(() => {
    const openGame = (e: Event) => setView((e as CustomEvent).detail as GameId);
    const openHistory = () => setView('history');
    const openBonus = () => setBonusOpen(true);
    const openWithdraw = () => setWithdrawOpen(true);
    const openInfo = (e: Event) => { setInfo((e as CustomEvent).detail.kind); setInfoDetail((e as CustomEvent).detail.detail); };
    const handlers: Record<string, (e: Event) => void> = {
      'open-game': openGame,
      'open-history': openHistory,
      'open-bonus': openBonus,
      'open-withdraw': openWithdraw,
      'open-info': openInfo,
    };
    // map simple events
    const referrals = () => setInfo('referrals');
    const giveaways = () => setInfo('giveaways');
    const support = () => setInfo('support');
    const faq = () => setInfo('faq');
    const soon = (e: Event) => { setInfo('soon'); setInfoDetail((e as CustomEvent).detail); };
    window.addEventListener('open-game', openGame);
    window.addEventListener('open-history', openHistory);
    window.addEventListener('open-bonus', openBonus);
    window.addEventListener('open-withdraw', openWithdraw);
    window.addEventListener('open-referrals', referrals);
    window.addEventListener('open-giveaways', giveaways);
    window.addEventListener('open-support', support);
    window.addEventListener('open-faq', faq);
    window.addEventListener('open-soon', soon);
    void handlers;
    return () => {
      window.removeEventListener('open-game', openGame);
      window.removeEventListener('open-history', openHistory);
      window.removeEventListener('open-bonus', openBonus);
      window.removeEventListener('open-withdraw', openWithdraw);
      window.removeEventListener('open-referrals', referrals);
      window.removeEventListener('open-giveaways', giveaways);
      window.removeEventListener('open-support', support);
      window.removeEventListener('open-faq', faq);
      window.removeEventListener('open-soon', soon);
    };
  }, []);

  const openInfoModal = (kind: 'referrals' | 'giveaways' | 'support' | 'faq' | 'soon', detail?: string) => {
    setInfo(kind); setInfoDetail(detail);
  };

  const backToLobby = () => { setView('lobby'); sfx.click(); };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-md flex-col sm:max-w-2xl">
        <Header
          game={game}
          soundOn={soundOn}
          onToggleSound={toggleSound}
          onOpenDrawer={() => { sfx.click(); setNavOpen(true); }}
          onTopUp={() => { sfx.click(); setRefillOpen(true); }}
          onChat={() => openInfoModal('support')}
        />

        <main className="flex-1 p-3 sm:p-4">
          {view === 'lobby' && (
            <Lobby
              game={game}
              onPlay={(id) => setView(id)}
              onOpenBonus={() => setBonusOpen(true)}
              onEvent={openInfoModal}
            />
          )}
          {view === 'mines' && <Mines game={game} onBack={backToLobby} />}
          {view === 'crash' && <Crash game={game} onBack={backToLobby} />}
          {view === 'dice' && <Dice game={game} onBack={backToLobby} />}
          {view === 'bubbles' && <Bubbles game={game} onBack={backToLobby} />}
          {view === 'history' && (
            <div className="animate-slide-up">
              <button onClick={backToLobby} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
                ← Назад в лобби
              </button>
              <HistoryView game={game} />
            </div>
          )}
        </main>
      </div>

      <NavDrawer
        open={navOpen}
        onClose={() => setNavOpen(false)}
        game={game}
        onBonus={() => { setNavOpen(false); setBonusOpen(true); }}
      />
      <RefillModal open={refillOpen} onClose={() => setRefillOpen(false)} game={game} />
      <WithdrawModal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} game={game} />
      <BonusModal open={bonusOpen} onClose={() => setBonusOpen(false)} game={game} />
      <InfoModal kind={info} onClose={() => setInfo(null)} detail={infoDetail} />
    </div>
  );
}
