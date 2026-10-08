import { getCurrentWindow } from "@tauri-apps/api/window";

// `open -a Terax` reactivates the app at the OS level but does not raise a
// minimized or occluded window. Idempotent and safe on a cold start where the
// boot show in main.tsx already ran by the time this can fire.
export function activateMainWindow(): void {
  const win = getCurrentWindow();
  void win.show().catch(() => {});
  void win.unminimize().catch(() => {});
  void win.setFocus().catch(() => {});
}
