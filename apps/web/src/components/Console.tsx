// Console surfaces the rung-0 deterministic message (GAME_DESIGN.md hint
// progression) — no AI call involved for this rung.
export function Console(props: { rung0Message: string | null; hiddenTwist: { narrativeMessage: string } | null }) {
  if (!props.rung0Message && !props.hiddenTwist) return null;
  return (
    <div style={{ background: "#101218", color: "#E8E6E1", padding: 12, borderRadius: 8, fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>
      {props.hiddenTwist && <div>{props.hiddenTwist.narrativeMessage}</div>}
      {props.rung0Message && <div>{props.rung0Message}</div>}
    </div>
  );
}
