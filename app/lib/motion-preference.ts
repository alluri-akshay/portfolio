// Site controls are independent of OS settings. Explicit choices survive reloads.
export const motionStorageKey = "portfolio.reduce-motion";
const changeEvent = "portfolio:motion-preference";
let sessionChoice: boolean | undefined;

export function getMotionSnapshot(): boolean {
  if (sessionChoice !== undefined) return sessionChoice;
  try { return window.localStorage.getItem(motionStorageKey) === "true"; }
  catch { return false; }
}

export const getServerMotionSnapshot = () => false;

export function setReducedMotion(value: boolean) {
  sessionChoice = value;
  try { window.localStorage.setItem(motionStorageKey, String(value)); }
  catch { /* The in-memory choice still works when storage is unavailable. */ }
  document.documentElement.dataset.motion = value ? "reduced" : "full";
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeMotion(update: () => void) {
  const synchronize = () => {
    document.documentElement.dataset.motion = getMotionSnapshot() ? "reduced" : "full";
    update();
  };
  const storage = (event: StorageEvent) => {
    if (event.key !== motionStorageKey && event.key !== null) return;
    sessionChoice = undefined;
    synchronize();
  };
  window.addEventListener(changeEvent, synchronize);
  window.addEventListener("storage", storage);
  synchronize();
  return () => {
    window.removeEventListener(changeEvent, synchronize);
    window.removeEventListener("storage", storage);
  };
}

// Apply the stored static alternative before paint without changing SSR text.
export const motionInitScript = `(function(){var r=false;try{r=localStorage.getItem("${motionStorageKey}")==="true";}catch(e){}document.documentElement.dataset.motion=r?"reduced":"full";})();`;
