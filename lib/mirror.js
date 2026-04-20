// Swap directional words so a mirrored dancer reads the right side.
// Placeholder token prevents double-swapping when both words are present.
const PAIRS = [
  ["left", "right"],
  ["Left", "Right"],
  ["LEFT", "RIGHT"],
  ["clockwise", "counter-clockwise"],
  ["Clockwise", "Counter-clockwise"],
];

export function mirrorText(text) {
  if (!text) return text;
  let out = text;
  PAIRS.forEach(([a, b], i) => {
    const tokenA = `\u0000A${i}\u0000`;
    const tokenB = `\u0000B${i}\u0000`;
    out = out.split(a).join(tokenA).split(b).join(tokenB);
    out = out.split(tokenA).join(b).split(tokenB).join(a);
  });
  return out;
}
