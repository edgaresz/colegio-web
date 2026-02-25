/// <reference types="astro/client" />

interface NetlifyIdentityWidget {
  init(): void;
  open(mode?: "login" | "signup"): void;
  on(event: "init", callback: (user?: unknown) => void): void;
  on(event: "login", callback: () => void): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
}

interface Window {
  netlifyIdentity?: NetlifyIdentityWidget;
}
