import { useState } from "react";
import type { PublicQuestion, QuizQuestionResult } from "@atlas/shared-types";
import { api, errorText } from "../api/client.js";
import { Markdown } from "./Markdown.js";

// One question, in either of two modes:
//  - "check": a lesson's knowledge check, graded on its own the moment the
//    learner submits (with feedback on the misconception and an explanation);
//  - "quiz": an answer collected for a whole-quiz submission, with the
//    graded result passed back in afterwards.
// Correctness is always shown as icon + text, never colour alone.

interface Common {
  question: PublicQuestion;
  number?: number;
}

export function QuestionPrompt(props: Common) {
  const q = props.question;
  return (
    <>
      <div className="question-prompt" id={`prompt-${q.id}`}>
        {props.number !== undefined && <span className="question-num">{props.number}</span>}
        <span>
          <Markdown text={q.prompt} inline />
        </span>
      </div>
      {q.code && <pre className="question-code">{q.code}</pre>}
    </>
  );
}

function AnswerInput(props: {
  question: PublicQuestion;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const q = props.question;
  if (q.kind === "mcq") {
    return (
      <div className="options" role="radiogroup">
        {q.options?.map((o) => (
          <label key={o.id} className={`option ${props.value === o.id ? "selected" : ""}`}>
            <input
              type="radio"
              name={q.id}
              value={o.id}
              checked={props.value === o.id}
              disabled={props.disabled}
              onChange={() => props.onChange(o.id)}
            />
            <span>
              <Markdown text={o.text} inline />
            </span>
          </label>
        ))}
      </div>
    );
  }
  return (
    <label className="output-answer">
      <span>Type the exact output (one line per printed line)</span>
      <textarea
        value={props.value}
        rows={Math.max(2, props.value.split("\n").length)}
        spellCheck={false}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

export function KnowledgeCheck(props: Common & { onCorrect: (questionId: string, xp: number) => void }) {
  const q = props.question;
  const [value, setValue] = useState("");
  const [state, setState] = useState<{ correct: boolean; feedback: string | null; explanation: string } | null>(
    q.answeredCorrectly ? { correct: true, feedback: null, explanation: q.explanation ?? "" } : null
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function check() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.answerQuestion(q.id, value);
      setState(res);
      if (res.correct) props.onCorrect(q.id, res.xpGained);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  const done = state?.correct === true;
  return (
    <div role="group" aria-labelledby={`prompt-${q.id}`} className={`question card check ${done ? "is-correct" : ""}`}>
      <div className="eyebrow">
        <span aria-hidden="true">◆</span> Knowledge check
      </div>
      <QuestionPrompt question={q} />
      {!done && (
        <>
          <AnswerInput question={q} value={value} onChange={setValue} disabled={busy} />
          <div>
            <button className="btn-primary btn-small" onClick={check} disabled={busy || value.trim() === ""}>
              Check answer
            </button>
          </div>
        </>
      )}
      <div aria-live="polite">
        {error && <p className="danger-text">{error}</p>}
        {state && (
          <div className={`feedback ${state.correct ? "good" : "bad"}`}>
            <strong>
              <span aria-hidden="true">{state.correct ? "✓" : "✗"}</span> {state.correct ? "Correct" : "Not quite"}
            </strong>
            {state.feedback && <p>{state.feedback}</p>}
            {state.explanation && (
              <p>
                <em>Why: </em>
                {state.explanation}
              </p>
            )}
            {!state.correct && !state.explanation && <p className="muted">Have another go — the explanation appears after a correct answer or a second try.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export function QuizQuestion(
  props: Common & {
    value: string;
    onChange: (v: string) => void;
    result?: QuizQuestionResult;
    onReview?: (levelId: string) => void;
  }
) {
  const r = props.result;
  return (
    <div
      role="group"
      aria-labelledby={`prompt-${props.question.id}`}
      className={`question card ${r ? (r.correct ? "is-correct" : "is-wrong") : ""}`}
    >
      <QuestionPrompt question={props.question} number={props.number} />
      <AnswerInput question={props.question} value={props.value} onChange={props.onChange} disabled={!!r} />
      {r && (
        <div className={`feedback ${r.correct ? "good" : "bad"}`}>
          <strong>
            <span aria-hidden="true">{r.correct ? "✓" : "✗"}</span> {r.correct ? "Correct" : "Missed"}
          </strong>
          {r.feedback && <p>{r.feedback}</p>}
          {r.explanation && (
            <p>
              <em>Why: </em>
              {r.explanation}
            </p>
          )}
          {r.reviewLevel && props.onReview && (
            <p>
              Review:{" "}
              <button className="link-button" onClick={() => props.onReview!(r.reviewLevel!.id)}>
                {r.reviewLevel.title} →
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
