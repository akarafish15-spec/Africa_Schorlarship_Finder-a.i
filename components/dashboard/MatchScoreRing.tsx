interface MatchScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function MatchScoreRing({ score, size = 56, strokeWidth = 4 }: MatchScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  const color = score >= 75 ? "#adc6ff" : score >= 50 ? "#ffb95f" : "#8c909f";
  const bgColor = score >= 75 ? "rgba(173,198,255,0.1)" : score >= 50 ? "rgba(255,185,95,0.1)" : "rgba(140,144,159,0.1)";

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-label font-bold text-xs"
          style={{ color }}
        >
          {score}%
        </span>
      </div>
    </div>
  );
}
