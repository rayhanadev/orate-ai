"use client";

import { useId } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignupForm({
  action,
  initialState,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (_: unknown, formData: FormData) => Promise<any>;
  initialState: {
    email: string;
    password: string;
  };
}) {
  const emailId = useId();
  const passwordId = useId();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [state, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();

  return (
    <>
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        state.errors?.length && (
          <p className="text-destructive">
            {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              state.errors[0]
            }
          </p>
        )
      }
      <form
        action={formAction}
        className="flex w-full flex-col items-start justify-start gap-4"
      >
        <div className="flex w-full flex-col items-start justify-start gap-2">
          <Label htmlFor={emailId}>Email</Label>
          <Input id={emailId} name="email" type="email" required />
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-2">
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
