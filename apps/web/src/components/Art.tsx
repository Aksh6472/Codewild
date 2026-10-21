// Inline SVG illustrations (no image assets or new dependencies). Flat /
// illustrated style per design.md §6.1 — deliberately not pixel art. All art
// is decorative (aria-hidden); meaning is always carried by adjacent text.

// Placeholder crest only — no final logo before DECISIONS.md D5 resolves.
export function Crest(props: { size?: number }) {
  const size = props.size ?? 44;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd36e" />
          <stop offset="1" stopColor="#d9962b" />
        </linearGradient>
      </defs>
      <path d="M24 3 L42 9 V24 C42 34 34 41 24 45 C14 41 6 34 6 24 V9 Z" fill="url(#crest-gold)" />
      <path d="M24 8 L37 12.5 V24 C37 31.5 31.5 36.5 24 39.5 C16.5 36.5 11 31.5 11 24 V12.5 Z" fill="#1a2245" />
      <path d="M19 18 L14 24 L19 30 M29 18 L34 24 L29 30 M26 16 L22 32" stroke="#ffd36e" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Robot(props: { size?: number; happy?: boolean }) {
  const size = props.size ?? 180;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 200 230" aria-hidden="true">
      <defs>
        <radialGradient id="robot-shell" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9c4b8" />
        </radialGradient>
        <radialGradient id="robot-eye" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c9fbff" />
          <stop offset="0.5" stopColor="#3ee0ff" />
          <stop offset="1" stopColor="#0aa5d6" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="218" rx="60" ry="9" fill="#000" opacity="0.35" />
      {/* cape */}
      <path d="M52 120 C40 160 38 195 48 212 L152 212 C162 195 160 160 148 120 Z" fill="#b8322f" />
      <path d="M52 120 C46 150 46 180 52 205 L62 205 C58 178 60 150 66 124 Z" fill="#8f2422" />
      {/* body */}
      <rect x="66" y="118" width="68" height="70" rx="22" fill="url(#robot-shell)" />
      <circle cx="100" cy="148" r="11" fill="#e7a83a" stroke="#8b5a12" strokeWidth="3" />
      <path d="M100 141 L100 155 M93 148 L107 148" stroke="#8b5a12" strokeWidth="3" strokeLinecap="round" />
      {/* legs */}
      <rect x="74" y="184" width="20" height="26" rx="8" fill="url(#robot-shell)" />
      <rect x="106" y="184" width="20" height="26" rx="8" fill="url(#robot-shell)" />
      {/* arms */}
      <rect x="44" y="128" width="20" height="44" rx="10" fill="url(#robot-shell)" transform={props.happy ? "rotate(40 54 132)" : undefined} />
      <rect x="136" y="128" width="20" height="44" rx="10" fill="url(#robot-shell)" transform={props.happy ? "rotate(-40 146 132)" : undefined} />
      {/* head */}
      <circle cx="100" cy="72" r="56" fill="url(#robot-shell)" />
      <rect x="58" y="48" width="84" height="54" rx="27" fill="#141a2e" />
      {props.happy ? (
        <>
          <path d="M72 80 Q81 66 90 80" stroke="url(#robot-eye)" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M110 80 Q119 66 128 80" stroke="url(#robot-eye)" strokeWidth="8" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="81" cy="75" rx="10" ry="13" fill="url(#robot-eye)" />
          <ellipse cx="119" cy="75" rx="10" ry="13" fill="url(#robot-eye)" />
        </>
      )}
      <circle cx="100" cy="14" r="6" fill="#e7a83a" />
      <rect x="98" y="16" width="4" height="10" fill="#c9c4b8" />
    </svg>
  );
}

type IslandVariant = "village" | "fortress" | "spires";

// A floating island with a settlement silhouette on top. Locked islands render
// desaturated with a padlock, so the locked state is never colour-only.
export function Island(props: { variant: IslandVariant; locked: boolean }) {
  const grass = props.locked ? "#3a4058" : "#4f8f47";
  const grassDark = props.locked ? "#2c3146" : "#3a6e35";
  const rock = props.locked ? "#262b3d" : "#5a4636";
  const rockDark = props.locked ? "#1b1f2d" : "#3d2f25";
  const wall = props.locked ? "#40475f" : "#e8d6b0";
  const roof = props.locked ? "#2b3044" : "#c2553d";
  const id = `${props.variant}-${props.locked ? "l" : "u"}`;

  return (
    <svg viewBox="0 0 320 260" aria-hidden="true">
      <defs>
        <linearGradient id={`rock-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={rock} />
          <stop offset="1" stopColor={rockDark} />
        </linearGradient>
      </defs>
      {/* rock underside */}
      <path d="M30 150 L290 150 L250 190 L210 205 L180 250 L150 215 L110 225 L80 195 Z" fill={`url(#rock-${id})`} />
      {/* grass top */}
      <ellipse cx="160" cy="150" rx="132" ry="26" fill={grassDark} />
      <ellipse cx="160" cy="144" rx="128" ry="22" fill={grass} />
      {/* trees */}
      {[52, 70, 250, 268].map((x) => (
        <g key={x}>
          <rect x={x - 2} y={128} width="4" height="12" fill={rockDark} />
          <circle cx={x} cy={124} r="11" fill={grassDark} />
        </g>
      ))}
      {props.variant === "village" && (
        <g>
          <rect x="110" y="88" width="100" height="52" fill={wall} />
          <path d="M104 92 L160 56 L216 92 Z" fill={roof} />
          <rect x="146" y="40" width="28" height="60" fill={wall} />
          <path d="M140 44 L160 14 L180 44 Z" fill={roof} />
          <rect x="94" y="100" width="22" height="40" fill={wall} />
          <path d="M90 104 L105 82 L120 104 Z" fill={roof} />
          <rect x="204" y="100" width="22" height="40" fill={wall} />
          <path d="M200 104 L215 82 L230 104 Z" fill={roof} />
          <path d="M150 140 V122 A10 10 0 0 1 170 122 V140 Z" fill="#5a3a22" />
          {!props.locked && (
            <>
              <rect x="156" y="58" width="8" height="10" rx="2" fill="#ffd36e" />
              <rect x="126" y="104" width="8" height="10" rx="2" fill="#ffd36e" />
              <rect x="186" y="104" width="8" height="10" rx="2" fill="#ffd36e" />
            </>
          )}
        </g>
      )}
      {props.variant === "fortress" && (
        <g>
          <rect x="96" y="70" width="128" height="70" fill={wall} />
          {[96, 116, 136, 156, 176, 196, 216].map((x) => (
            <rect key={x} x={x} y="62" width="10" height="10" fill={wall} />
          ))}
          <rect x="140" y="24" width="40" height="60" fill={wall} />
          <path d="M134 28 L160 0 L186 28 Z" fill={roof} />
          <rect x="84" y="50" width="24" height="90" fill={wall} />
          <path d="M80 54 L96 30 L112 54 Z" fill={roof} />
          <rect x="212" y="50" width="24" height="90" fill={wall} />
          <path d="M208 54 L224 30 L240 54 Z" fill={roof} />
        </g>
      )}
      {props.variant === "spires" && (
        <g>
          <rect x="112" y="80" width="96" height="60" fill={wall} />
          <rect x="128" y="34" width="22" height="106" fill={wall} />
          <path d="M124 38 L139 4 L154 38 Z" fill={roof} />
          <rect x="170" y="48" width="22" height="92" fill={wall} />
          <path d="M166 52 L181 18 L196 52 Z" fill={roof} />
          <rect x="98" y="96" width="18" height="44" fill={wall} />
          <path d="M94 100 L107 76 L120 100 Z" fill={roof} />
          <rect x="204" y="96" width="18" height="44" fill={wall} />
          <path d="M200 100 L213 76 L226 100 Z" fill={roof} />
        </g>
      )}
      {props.locked && (
        <g transform="translate(160 104)">
          <circle r="26" fill="#0a0f1f" opacity="0.75" />
          <path d="M-9 -2 V-9 A9 9 0 0 1 9 -9 V-2" stroke="#ecebf3" strokeWidth="4" fill="none" />
          <rect x="-13" y="-3" width="26" height="20" rx="4" fill="#ecebf3" />
          <circle cy="6" r="3" fill="#0a0f1f" />
        </g>
      )}
    </svg>
  );
}
