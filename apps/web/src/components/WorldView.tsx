import { useEffect, useRef } from "react";

export type WorldState = "idle" | "running" | "passed" | "failed";

// Hand-rolled Canvas 2D renderer (TECH.md §3 — starting point before PixiJS,
// if ever needed). For levels 1-3 the "world" is deliberately simple: a
// speech bubble / name-tag sign / battery gauge, each driven directly by the
// last run's stdout — see the plan's "generic world-state protocol is
// follow-on work for level 4+" note. No idle animation runs here while the
// editor is focused (design.md §6.4 / UI_UX.md).
export function WorldView(props: { concept: string; state: WorldState; stdout: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.fillStyle = "#14161C"; // --bg (dark theme token, design.md §6.2)
    ctx.fillRect(0, 0, width, height);

    drawRobot(ctx, width / 2 - 24, height - 100);
    drawOverlay(ctx, props, width, height);
  }, [props.concept, props.state, props.stdout]);

  return <canvas ref={canvasRef} width={480} height={320} style={{ border: "1px solid #2A2D37", borderRadius: 8 }} />;
}

function drawRobot(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#F2A33A"; // --brand
  ctx.fillRect(x, y, 48, 56); // body
  ctx.fillStyle = "#E8E6E1"; // --text
  ctx.fillRect(x + 10, y + 12, 10, 10); // eye
  ctx.fillRect(x + 28, y + 12, 10, 10); // eye
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  props: { concept: string; state: WorldState; stdout: string },
  width: number,
  height: number
) {
  ctx.font = "16px Inter, sans-serif";
  ctx.fillStyle = props.state === "failed" ? "#EF6F6C" : "#E8E6E1"; // --danger / --text

  if (props.state === "idle") {
    ctx.fillText("Press Run to see what happens...", 24, 40);
    return;
  }
  if (props.state === "running") {
    ctx.fillText("Running...", 24, 40);
    return;
  }

  switch (props.concept) {
    case "print-output": {
      // Speech bubble showing the robot's printed line.
      ctx.strokeStyle = "#5BC0BE";
      ctx.strokeRect(20, 20, width - 40, 48);
      ctx.fillText(props.stdout || "(no output)", 32, 48);
      break;
    }
    case "variables-strings": {
      // A name-tag sign.
      ctx.strokeStyle = "#5BC0BE";
      ctx.strokeRect(width / 2 - 100, 24, 200, 44);
      ctx.fillText(props.stdout || "(no output)", width / 2 - 90, 52);
      break;
    }
    case "operators": {
      // A battery gauge derived from the printed line.
      const match = /Battery needed: (\d+)/.exec(props.stdout);
      const value = match ? Number(match[1]) : 0;
      ctx.strokeStyle = "#5BC0BE";
      ctx.strokeRect(24, 24, 200, 24);
      ctx.fillStyle = "#A78BFA"; // --xp
      ctx.fillRect(26, 26, Math.min(196, value * 2), 20);
      ctx.fillStyle = "#E8E6E1";
      ctx.fillText(props.stdout || "(no output)", 24, 70);
      break;
    }
    default:
      ctx.fillText(props.stdout || "(no output)", 24, 40);
  }

  if (props.state === "passed") {
    ctx.fillStyle = "#6BCB77"; // --success
    ctx.fillText("✓ Level passed!", 24, height - 20);
  } else if (props.state === "failed") {
    ctx.fillText("✗ Not quite yet.", 24, height - 20);
  }
}
