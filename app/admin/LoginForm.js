"use client";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "./actions";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Checking…" : "Unlock"}
    </button>
  );
}

export default function LoginForm() {
  const [state, action] = useFormState(loginAction, null);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="block text-sm text-mute mb-1" htmlFor="password">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="input"
          required
        />
      </div>
      {state?.error && (
        <p className="text-hard text-sm">{state.error}</p>
      )}
      <SubmitBtn />
    </form>
  );
}
