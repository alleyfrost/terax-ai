import { invoke } from "@tauri-apps/api/core";

let cached: string | undefined;

export async function initLaunchDir(): Promise<void> {
  const dir =
    (await invoke<string | null>("get_launch_dir").catch(() => null)) ??
    (await invoke<string>("workspace_current_dir").catch(() => null));
  cached = dir ? dir.replace(/\\/g, "/") : undefined;
}

export function getLaunchDir(): string | undefined {
  return cached;
}

/**
 * Drains the files passed via the OS "Open With" action (CLI args on
 * Linux/Windows, macOS open-files event). Drained once so HMR / re-mounts
 * can't replay them. Returns [] when the app wasn't launched with a file.
 */
export async function consumeLaunchFiles(): Promise<string[]> {
  const files = await invoke<string[]>("get_launch_files").catch(() => []);
  return files.map((f) => f.replace(/\\/g, "/"));
}

/**
 * Drains a directory opened via the OS action on a cold start (macOS
 * `open -a Terax <dir>`), so it can land as a fresh terminal tab after boot
 * rather than only seeding the workspace cwd. Returns null when no directory
 * was opened, so the launch cwd context still applies without adding a tab.
 */
export async function consumeLaunchOpenDir(): Promise<string | null> {
  const dir = await invoke<string | null>("get_launch_open_dir").catch(() => null);
  return dir ? dir.replace(/\\/g, "/") : null;
}
