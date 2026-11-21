import { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: 'left' | 'right';
  width?: string;
}

export default function Drawer({ open, onClose, children, title, side = 'left', width = 'max-w-sm' }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`absolute top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full w-full ${width} overflow-y-auto bg-canvas shadow-2xl ${
          side === 'left' ? 'animate-slide-right' : 'animate-slide-up'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-lavender/60 bg-canvas/90 px-4 py-3 backdrop-blur-xl">
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl text-ink-700 hover:bg-lavender">
            {side === 'left' ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
          {title && <span className="font-semibold text-ink-900">{title}</span>}
          <div className="w-9" />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
