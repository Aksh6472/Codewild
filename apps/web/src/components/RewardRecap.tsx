import type { RewardResponse } from "@atlas/shared-types";

// design.md §3.6: "What you just learned" card is mandatory; "Next quest" and
// "Back to map" are always equal-weight, neither ever hidden/greyed.
export function RewardRecap(props: { reward: RewardResponse; onNext: () => void; onBackToMap: () => void }) {
  return (
    <div style={{ background: "#1E222B", color: "#E8E6E1", padding: 16, borderRadius: 8, marginTop: 12 }}>
      <p>
        +{props.reward.xpGained} XP · +{props.reward.coinsGained} coins
      </p>
      <p style={{ fontStyle: "italic" }}>{props.reward.whatYouLearned.sentence}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={props.onNext}>Next quest</button>
        <button onClick={props.onBackToMap}>Back to map</button>
      </div>
    </div>
  );
}
