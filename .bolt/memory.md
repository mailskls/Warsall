# Project memory

## Product intent & audience

- **NEXUS** — modern, clean light-mode online casino & mini-games prototype inspired by sleek Telegram Mini Apps and fintech interfaces.
- Target: casual players; mobile-first but responsive to centered desktop containers.
- Virtual demo coins only (no real money); starting balance 1,000.00 coins.
- All user-facing UI text is in Russian.

## Brand personality & voice

- Sleek, modern, playful-but-clean fintech feel; generous spacing; smooth micro-interactions.
- Tone: direct Russian UI labels («Пополнить», «Вывести», «Забрать выигрыш», «Поставить», «Играть»).

## Visual design & UX direction

- **Palette:** canvas `#F2F4F8`; white rounded-2xl cards (`shadow-sm`); primary azure `#3B82F6` / `#2563EB`; secondary lavender-gray `#E5E9F2`; gold `#F59E0B` for coins; text slate `#1E293B`, muted `#64748B`.
- **Type:** Inter sans-serif; dark slate headings/numbers, muted gray labels/dividers.
- **Layout:** mobile-first, `max-w-md` / `max-w-2xl` centered on desktop.
- **Structure:** top header (flame logo, menu toggle, pill balance widget with gold coin + blue «+», chat button) → collapsible left drawer (profile card, wallet card, «Меню» grid, «Игры» grid) → interactive game stage with «← Назад в лобби».
- **Animations:** fade/slide/pop/shake transitions; active press feedback; WebAudio sound effects (clicks/ticks/wins/gems/bombs) — no audio asset files.
- **Components:** BetPanel shared across games; generic Modal; InfoModal for static sections; pill-shaped menu/game cards with blue-tinted icons.

## Decisions, constraints & rationale

- Stack: Vite + React (JSX), Tailwind CSS, lucide-react icons; `@/` path alias → `src/`. No extra UI/icon/theme packages.
- Games playable: Mines (5×5, 1–24 mines, glowing diamonds, «Забрать выигрыш»), Crash (blue-gradient curve, auto-cashout), Dice (slider 1–99, Меньше/Больше, live win chance), Bubbles (target multiplier, inflate animation).
- Coming-soon previews: Jackpot, Slots, X50, Keno — marked «Скоро».
- Modals: Бонусы (+500 free, once per session), Пополнить (quick packs + custom), Вывести (demo), Рефералы/Розыгрыши/Поддержка/FAQ (info), История игр (table of игра/ставка/множитель/выплата).
- Balance + game history live in React state for the session (not persisted to storage); bets capped at current balance.
- Build and typecheck both pass clean.

## Open questions & assumptions

- Persistence is session-only; long-term localStorage/user accounts not yet requested.
- Audio is WebAudio-synthesized; no user volume controls implemented yet.
- Coming-soon games are visual placeholders only; no defined roadmap for implementation.