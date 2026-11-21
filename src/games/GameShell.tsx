import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  onBack: () => void;
  children: ReactNode;
  emoji?: string;
}

export default function GameShell({ title, onBack, children, emoji }: Props) {
  return (
    <div className="animate-slide-up">
      <button onClick={onBack} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" /> Назад в лобби
      </button>
      <div className="mb-3 flex items-center gap-2">
        {emoji && <span className="text-2xl">{emoji}</span>}
        <h1 className="font-extrabold text-ink-900">{title}</h1>
      </div>
      {children}
    </div>
  );
}
