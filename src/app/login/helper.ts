"use client";
import { authSchema } from "@/lib/zod/authSchema";
import { signIn } from "next-auth/react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

export const onSubmit = async (formData: FormData, setErrors: Dispatch<SetStateAction<string[] | undefined>>, router: AppRouterInstance) => {
  const parsedData = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success || parsedData.error) {
    const emailErr = parsedData.error.flatten().fieldErrors.email;
    const passwordErr = parsedData.error.flatten().fieldErrors.password;
    let err = emailErr && passwordErr ? emailErr.concat(passwordErr) : emailErr ? emailErr : passwordErr;
    setErrors(err);
    return;
  }

  const res = await signIn("credentials", {
    email: parsedData.data?.email,
    password: parsedData.data?.password,
    redirect: false,
  });

  if (!res || res.error) setErrors(["Email and password do not match"]);
  else {
    setErrors([]);
    router.push("/");
    router.refresh();
  }
};
