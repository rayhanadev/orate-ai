import { redirect } from "next/navigation";

import LoginForm from "components/LoginForm";

import { validateRequest } from "lib/auth";

import { login } from "./actions";

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
        <h1 className="font-bold text-3xl">Login</h1>
        <p>Enter your email or username.</p>
      </div>
      <LoginForm action={login} initialState={initialState} />
      <p>
        Need to create an account?{" "}
        <a href="/signup" className="underline">
          Sign up
        </a>
        .
      </p>
    </div>
  );
}
