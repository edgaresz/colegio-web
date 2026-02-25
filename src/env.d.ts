/// <reference types="astro/client" />

export {};

interface NetlifyIdentityWidget {
  init(): void;
  open(mode?: "login" | "signup"): void;
  logout(): void;
  currentUser(): unknown;
  on(event: "init", callback: (user?: unknown) => void): void;
  on(event: "login", callback: () => void): void;
  on(event: "signup", callback: () => void): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
}

declare global {
  interface Window {
    netlifyIdentity?: NetlifyIdentityWidget;
  }
}
