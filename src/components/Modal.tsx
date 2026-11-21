import { useEffect } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children, icon }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {icon}
            <h2 className="font-bold text-ink-900">{title}</h2>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-xl text-ink-500 hover:bg-lavender">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
