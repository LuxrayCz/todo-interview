"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
type Props = {
  session: Session | null;
};
const Navbar = ({ session }: Props) => {
  if (session && session.user)
    return (
      <div className="fixed w-full top-0 h-[64px] bg-gray-600">
        <div className="container mx-auto flex justify-end items-center h-full">
          <Button
            onClick={() => {
              signOut();
              redirect("/login");
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    );
  return null;
};

export default Navbar;
