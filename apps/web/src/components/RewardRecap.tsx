import type { RewardResponse } from "@atlas/shared-types";
import { Robot } from "./Art.js";

// design.md §3.6: "What you just learned" card is mandatory; "Next quest" and
// "Back to quests" are always equal-weight, neither ever hidden/greyed.
export function RewardRecap(props: { reward: RewardResponse; onNext: () => void; onBack: () => void }) {
  return (
    <section className="card reward-card" aria-label="Level complete">
      <div className="companion">
        <Robot size={90} happy />
        <div className="speech">
          Level complete! +{props.reward.xpGained} XP · +{props.reward.coinsGained} coins
          <br />
          <em>{props.reward.whatYouLearned.sentence}</em>
        </div>
      </div>
      <div className="reward-actions">
        <button className="btn-ghost" onClick={props.onBack}>
          Back to quests
        </button>
        <button className="btn-primary" onClick={props.onNext}>
          Next Level <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
