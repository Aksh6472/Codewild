// Console surfaces the rung-0 deterministic message (GAME_DESIGN.md hint
// progression) — no AI call involved for this rung.
export function Console(props: { rung0Message: string | null; hiddenTwist: { narrativeMessage: string } | null }) {
  if (!props.rung0Message && !props.hiddenTwist) return null;
  return (
    <div className="console-msg">
      {props.hiddenTwist && <div>{props.hiddenTwist.narrativeMessage}</div>}
      {props.rung0Message && <div>{props.rung0Message}</div>}
    </div>
  );
}
