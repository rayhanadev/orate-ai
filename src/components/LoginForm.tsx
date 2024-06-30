"use client";

import { useId } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { ActionResult } from "next/dist/server/app-render/types";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function LoginForm({
  action,
  initialState,
}: {
  action: (_: any, formData: FormData) => Promise<ActionResult>;
  initialState: any;
}) {
  const emailId = useId();
  const passwordId = useId();
  const [state, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();

  return (
    <>
      {state.errors && state.errors.length && (
        <p className="text-destructive">{state.errors[0]}</p>
      )}
      <form
        action={formAction}
        className="flex flex-col items-start justify-start gap-4 w-full"
      >
        <div className="flex flex-col items-start justify-start gap-2 w-full">
          <Label htmlFor={emailId}>Email or Username</Label>
          <Input id={emailId} name="email" type="text" required />
        </div>
        <div className="flex flex-col items-start justify-start gap-2 w-full">
          <Label htmlFor={passwordId}>Password</Label>
          <Input id={passwordId} name="password" type="password" required />
        </div>
        <Button type="submit" disabled={pending} className="w-full">
          Continue
        </Button>
      </form>
    </>
  );
}
