"use server";
import db from "@/lib/prisma";
import z from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import { authSchema } from "@/lib/zod/authSchema";

export async function register(state: { errors: string[] }, formData: FormData) {
  const parsedData = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsedData.success) {
    const emailErr = parsedData.error.flatten().fieldErrors.email;
    const passwordErr = parsedData.error.flatten().fieldErrors.password;
    let err = emailErr && passwordErr ? emailErr.concat(passwordErr) : emailErr ? emailErr : passwordErr;
    return {
      errors: err ?? [],
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: parsedData.data.email,
      },
    });
    if (user) {
      return { errors: ["User with this email already exists."] };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(parsedData.data.password, salt);
    await db.user.create({
      data: {
        email: parsedData.data.email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { errors: [error.message] };
    } else if (typeof error === "string") {
      return { errors: [error] };
    }
    return { errors: ["Something went wrong."] };
  }
  return redirect("/login");
}

export const getComments = async (uuid: string) => {
  const comments = await db.comment.findMany({
    where: {
      issueId: uuid,
    },
    select: {
      content: true,
      uuid: true,
      user: {
        select: {
          email: true,
        },
      },
      createdAt: true,
    },
  });
  return comments;
};
