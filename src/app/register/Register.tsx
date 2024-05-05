"use client";
import React from "react";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/actions/auth";

const initialState: { errors: string[] } = {
  errors: [],
};

const Register = () => {
  const [state, registerAction] = useFormState(register, initialState);
  const { pending } = useFormStatus();
  return (
    <div className="min-h-screen flex items-center ">
      <form action={registerAction} className="flex  flex-col mx-auto gap-2 items-center max-w-[350px]   ">
        <h2 className="text-left font-bold text-3xl mb-1 text-black/80">Register</h2>
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
        <Button disabled={pending} type="submit" color="warning" className="w-full font-semibold">
          Register
        </Button>{" "}
        {state.errors.map((error, index) => (
          <p key={index} className="text-red-500">
            {error}
          </p>
        ))}
        <p className="text-black/80">
          Already have an account?{" "}
          <Link className="hover:underline text-black" href={"/login"}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
