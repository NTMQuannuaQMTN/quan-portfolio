"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { inputClass, primaryButton } from "../ui/controls";

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="space-y-3">
      <input
        type="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        autoFocus
        required
        className={inputClass}
      />
      {error && <p className="text-sm text-accent">{error}</p>}
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
