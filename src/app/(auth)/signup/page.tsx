import { redirect } from "next/navigation";

import SignupForm from "components/SignupForm";

import { validateRequest } from "lib/auth";

import { signup } from "./actions";

const initialState = {
  email: "",
  password: "",
};

export default async function Page() {
  const { user } = await validateRequest();
  if (user) {
    return redirect("/home");
  }

  return (
    <div className="flex flex-col items-start justify-start gap-4 w-full">
      <div className="flex flex-col items-start justify-start gap-2">
        <h1 className="font-bold text-3xl">Sign up</h1>
        <p>Enter your email and password to create an account.</p>
      </div>
      <SignupForm action={signup} initialState={initialState} />
      <p>
        Already have an account?{" "}
        <a href="/login" className="underline">
          Log in
        </a>
        .
      </p>
    </div>
  );
}
