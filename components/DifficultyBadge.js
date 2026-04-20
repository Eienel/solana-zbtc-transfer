const STYLES = {
  easy: "bg-easy/15 text-easy",
  medium: "bg-medium/15 text-medium",
  hard: "bg-hard/15 text-hard",
};

export default function DifficultyBadge({ level }) {
  const key = (level || "easy").toLowerCase();
  const cls = STYLES[key] || STYLES.easy;
  return <span className={`pill ${cls}`}>{key}</span>;
}
