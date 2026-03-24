// Mirrored from `logo-generator/app.js` so the site and generator share the same palette set.
export const logoGradients = [
  { key: "sunset", name: "Sunset", colors: ["#ff9966", "#ff5e62"] },
  { key: "ocean", name: "Ocean", colors: ["#667eea", "#764ba2"] },
  { key: "fire", name: "Fire", colors: ["#ff0844", "#ffb199"] },
  { key: "matrix", name: "Matrix", colors: ["#00ff41", "#008f11"] },
  { key: "nebula", name: "Nebula", colors: ["#654ea3", "#eaafc8"] },
  { key: "gold", name: "Gold", colors: ["#f7971e", "#ffd200"] },
  { key: "forest", name: "Forest", colors: ["#134e5e", "#71b280"] },
  { key: "mint", name: "Mint", colors: ["#00d2ff", "#3a7bd5"] },
  { key: "ice", name: "Ice", colors: ["#e0eafc", "#cfdef3"] },
  { key: "coral", name: "Coral", colors: ["#ff9a9e", "#fad0c4"] },
  { key: "aurora", name: "Aurora", colors: ["#a8ff78", "#78ffd6"] }
] as const;

export type LogoGradient = (typeof logoGradients)[number];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string): [number, number, number] {
  const normalised = hex.replace("#", "");
  const value = Number.parseInt(normalised, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function rgbToHex([red, green, blue]: [number, number, number]): string {
  return `#${[red, green, blue]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function getGradientColour(
  colors: readonly [string, string] | readonly string[],
  t: number
): string {
  const [start, end] = colors;
  const [startRed, startGreen, startBlue] = hexToRgb(start);
  const [endRed, endGreen, endBlue] = hexToRgb(end);
  const mix = clamp(t, 0, 1);

  return rgbToHex([
    startRed + (endRed - startRed) * mix,
    startGreen + (endGreen - startGreen) * mix,
    startBlue + (endBlue - startBlue) * mix
  ]);
}

export function dimColour(hex: string, factor: number): string {
  const [red, green, blue] = hexToRgb(hex);
  return rgbToHex([red * factor, green * factor, blue * factor]);
}

export function getRandomLogoGradient(): LogoGradient {
  return logoGradients[Math.floor(Math.random() * logoGradients.length)];
}
