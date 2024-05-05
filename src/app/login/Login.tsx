"use client";
import { Button } from "@/components/ui/button";
import { authSchema } from "@/lib/zod/authSchema";
import { Lock, User } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { onSubmit } from "./helper";

export const initialState: { errors: string[] } = {
  errors: [],
};

const Login = () => {
  const [errors, setErrors] = useState<string[]>();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center ">
      <form
        action={(formData: FormData) => onSubmit(formData, setErrors, router)}
        className="flex  flex-col mx-auto gap-2 items-center max-w-[350px]   "
      >
        <h2 className="text-left font-bold text-3xl mb-1 text-black/80">Login</h2>
        <div className="relative w-full">
          <span className="absolute transform -translate-y-1/2 -translate-x-1/2 left-5 top-1/2">
            <User className=" h-5 w-5 " />
          </span>

          <input name="email" placeholder="Email" className="border w-full border-black text-black pl-10 text-lg py-2 rounded-lg" />
        </div>
        <div className="relative  w-full">
          <span className="absolute transform -translate-y-1/2 -translate-x-1/2 left-5 top-1/2">
            <Lock className="h-5 w-5  " />
          </span>

          <input
            name="password"
            placeholder="Password"
            className="border w-full border-black text-black pl-10 text-lg py-2 rounded-lg"
            type="password"
          />
        </div>
        <Button type="submit" color="warning" className="w-full font-semibold">
          Login
        </Button>
        {errors &&
          errors.map((error, index) => (
            <p key={index} className="text-red-500">
              {error}
            </p>
          ))}
        <p className="text-black/80">
          Do not have an account?{" "}
          <Link className="hover:underline text-black" href={"/register"}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
