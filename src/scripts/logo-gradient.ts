import { dimColour, getGradientColour, logoGradients } from "../lib/logo-gradients";

const LOGO_GRADIENT_SEEN_STORAGE_KEY = "abc-logo-gradient-seen";
const FIRST_LOAD_GRADIENT_KEY = "ice";
const FIRST_LOAD_GRADIENT_INDEX = Math.max(
  logoGradients.findIndex(({ key }) => key === FIRST_LOAD_GRADIENT_KEY),
  0
);

declare global {
  interface Window {
    __abcLogoGradientApplied?: boolean;
    __abcLogoGradientIndex?: number;
  }
}

function applyLogoGradient(index: number): void {
  const safeIndex = ((index % logoGradients.length) + logoGradients.length) % logoGradients.length;
  const gradient = logoGradients[safeIndex];

  window.__abcLogoGradientIndex = safeIndex;

  document.documentElement.style.setProperty("--logo-gradient-start", gradient.colors[0]);
  document.documentElement.style.setProperty("--logo-gradient-end", gradient.colors[1]);
  document.body?.setAttribute("data-logo-gradient", gradient.key);

  document.querySelectorAll<HTMLElement>("[data-logo-t]").forEach((element) => {
    const t = Number.parseFloat(element.dataset.logoT ?? "0.5");
    const baseColour = getGradientColour(gradient.colors, Number.isFinite(t) ? t : 0.5);
    element.style.color = element.dataset.logoDim === "true" ? dimColour(baseColour, 0.4) : baseColour;
  });

  document.querySelectorAll<HTMLElement>("[data-logo-rule]").forEach((element) => {
    element.style.color = getGradientColour(gradient.colors, 0.5);
  });
}

function applyNextLogoGradient(): void {
  const currentIndex = window.__abcLogoGradientIndex ?? 0;
  applyLogoGradient(currentIndex + 1);
}

function restartAnimatedLogos(): void {
  document.querySelectorAll<HTMLElement>("[data-logo-reanimate]").forEach((element) => {
    element.innerHTML = element.innerHTML;
  });
}

function handleLogoCycleClick(event: MouseEvent): void {
  if (!(event.target instanceof Element) || !event.target.closest("[data-logo-cycle]")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  applyNextLogoGradient();
  restartAnimatedLogos();
  applyLogoGradient(window.__abcLogoGradientIndex ?? 0);
}

function registerLogoCycleTriggers(): void {
  document.addEventListener("click", handleLogoCycleClick);
}

function hasSeenLogoGradients(): boolean {
  try {
    return window.localStorage.getItem(LOGO_GRADIENT_SEEN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markLogoGradientsSeen(): void {
  try {
    window.localStorage.setItem(LOGO_GRADIENT_SEEN_STORAGE_KEY, "true");
  } catch {
    // Ignore storage failures and fall back to the first-load palette.
  }
}

function getInitialLogoGradientIndex(): number {
  if (!hasSeenLogoGradients()) {
    markLogoGradientsSeen();
    return FIRST_LOAD_GRADIENT_INDEX;
  }

  return Math.floor(Math.random() * logoGradients.length);
}

function boot(): void {
  if (window.__abcLogoGradientApplied) {
    return;
  }

  window.__abcLogoGradientApplied = true;
  applyLogoGradient(getInitialLogoGradientIndex());
  registerLogoCycleTriggers();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
