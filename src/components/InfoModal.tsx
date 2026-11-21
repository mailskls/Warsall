import { Check, Info, MessageCircle, Users, Trophy, HelpCircle, Clock } from 'lucide-react';
import Modal from './Modal';

interface Props {
  kind: 'referrals' | 'giveaways' | 'support' | 'faq' | 'soon' | null;
  onClose: () => void;
  detail?: string;
}

const CONTENT: Record<string, { title: string; icon: React.ReactNode; body: React.ReactNode }> = {
  referrals: {
    title: 'Рефералы',
    icon: <Users className="h-5 w-5 text-brand-600" />,
    body: (
      <div className="space-y-3">
        <p className="text-sm text-ink-500">Приглашайте друзей и получайте 10% от их ставок виртуальными монетами.</p>
        <div className="rounded-xl bg-lavender p-3">
          <p className="text-xs text-ink-500">Ваш реферальный код</p>
          <p className="font-mono font-bold text-ink-900">NEXUS-4827193</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-lavender p-3 text-center">
            <p className="text-2xl font-bold text-brand-600">0</p>
            <p className="text-xs text-ink-500">Приглашено</p>
          </div>
          <div className="rounded-xl border border-lavender p-3 text-center">
            <p className="text-2xl font-bold text-gold-500">0</p>
            <p className="text-xs text-ink-500">Монет</p>
          </div>
        </div>
      </div>
    ),
  },
  giveaways: {
    title: 'Розыгрыши',
    icon: <Trophy className="h-5 w-5 text-gold-500" />,
    body: (
      <div className="space-y-3">
        <p className="text-sm text-ink-500">Участвуйте в ежедневных розыгрышах демо-монет среди всех игроков.</p>
        <div className="rounded-2xl border border-lavender p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink-900">Еженедельный джекпот</span>
            <span className="chip bg-gold-500/15 text-gold-600">50 000</span>
          </div>
          <p className="mt-2 text-xs text-ink-500">До розыгрыша: 3 дня 14 часов</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-lavender">
            <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
          </div>
        </div>
        <button className="btn-primary w-full">Участвовать</button>
      </div>
    ),
  },
  support: {
    title: 'Поддержка',
    icon: <MessageCircle className="h-5 w-5 text-brand-600" />,
    body: (
      <div className="space-y-3">
        <p className="text-sm text-ink-500">Мы на связи 24/7. Выберите удобный способ связи:</p>
        <button className="flex w-full items-center gap-3 rounded-2xl border border-lavender p-3 text-left transition-colors hover:bg-brand-50">
          <MessageCircle className="h-5 w-5 text-brand-600" />
          <span className="text-sm font-medium text-ink-900">Онлайн-чат</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-2xl border border-lavender p-3 text-left transition-colors hover:bg-brand-50">
          <Info className="h-5 w-5 text-brand-600" />
          <span className="text-sm font-medium text-ink-900">Email: support@nexus.demo</span>
        </button>
      </div>
    ),
  },
  faq: {
    title: 'Частые вопросы',
    icon: <HelpCircle className="h-5 w-5 text-brand-600" />,
    body: (
      <div className="space-y-3">
        {[
          ['Это реальные деньги?', 'Нет. NEXUS — демо-прототип с виртуальными монетами.'],
          ['Как получить больше монет?', 'Нажмите «+» в шапке или заберите ежедневный бонус.'],
          ['Сохраняется ли прогресс?', 'Баланс и история хранятся в рамках сессии браузера.'],
          ['Честные ли игры?', 'Да, все исходы определяются локальным генератором случайных чисел.'],
        ].map(([q, a]) => (
          <details key={q} className="rounded-xl border border-lavender p-3">
            <summary className="cursor-pointer text-sm font-semibold text-ink-900">{q}</summary>
            <p className="mt-2 text-sm text-ink-500">{a}</p>
          </details>
        ))}
      </div>
    ),
  },
  soon: {
    title: 'Скоро',
    icon: <Clock className="h-5 w-5 text-brand-600" />,
    body: (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <Clock className="h-10 w-10 text-brand-400" />
        <p className="font-semibold text-ink-900">Игра скоро появится</p>
        <p className="text-sm text-ink-500">Эта игра в разработке. Загляните позже!</p>
      </div>
    ),
  },
};

export default function InfoModal({ kind, onClose, detail }: Props) {
  if (!kind) return null;
  const c = CONTENT[kind];
  return (
    <Modal open={!!kind} onClose={onClose} title={kind === 'soon' && detail ? detail : c.title} icon={c.icon}>
      {c.body}
    </Modal>
  );
}
