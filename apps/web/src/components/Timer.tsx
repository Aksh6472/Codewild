import { useEffect, useState } from "react";

// Interview-practice countdown. It's informational only: running out of time
// never fails a quest (GAME_DESIGN.md "no fake urgency") — it just tells the
// learner how they'd have fared under real interview timing.
export function useElapsed(running: boolean) {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!running) {
      setStoppedAt((s) => s ?? Date.now());
      return;
    }
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return Math.floor(((stoppedAt ?? now) - start) / 1000);
}

export function formatClock(seconds: number) {
  const s = Math.abs(seconds);
  return `${seconds < 0 ? "-" : ""}${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Timer(props: { limitMinutes: number; elapsedSeconds: number }) {
  const left = props.limitMinutes * 60 - props.elapsedSeconds;
  const over = left < 0;
  return (
    <span className={`pill timer ${over ? "over" : ""}`} role="timer" aria-label={over ? "Over time" : "Time left"}>
      <span aria-hidden="true">⏱</span> {over ? `+${formatClock(-left)} over` : `${formatClock(left)} left`}
    </span>
  );
}
