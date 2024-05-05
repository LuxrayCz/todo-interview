"use server";

import { getAuthSession } from "@/lib/auth";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const todoSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  hours: z.string(),
  minutes: z.string(),
  seconds: z.string(),
});
const commentSchema = z.object({
  content: z.string().min(3, { message: "Comment must contain atleast 3 characters." }),
});

export async function createTodo(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user) return;
  const parsedData = todoSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    minutes: formData.get("minutes"),
    seconds: formData.get("seconds"),
    hours: formData.get("hours"),
  });

  if (!parsedData.success || parsedData.error) {
    return {};
  }
  const estimatedTimeInSec = parseInt(parsedData.data.hours) * 60 * 60 + parseInt(parsedData.data.minutes) * 60 + parseInt(parsedData.data.seconds);
  console.log(estimatedTimeInSec);
  try {
    await db.issue.create({
      data: {
        userId: session.user.id,
        name: parsedData.data.name,
        description: parsedData.data.description ?? null,
        estimatedTimeInSec,
      },
    });
    revalidatePath("/");
  } catch (error) {
    // if (error instanceof Error) {
    //   return { errors: [error.message] };
    // } else if (typeof error === "string") {
    //   return { errors: [error] };
    // }
    // return { errors: ["Something went wrong."] };
    return;
  }
}

export async function changeStatus(uuid: string) {
  const session = await getAuthSession();
  if (!session || !session.user)
    return {
      errors: ["You need to be authentificated"],
    };
  const issue = await db.issue.findUnique({
    where: {
      userId: session.user.id,
      uuid: uuid,
    },
    select: {
      done: true,
    },
  });
  await db.issue.update({
    where: {
      userId: session.user.id,
      uuid: uuid,
    },
    data: {
      done: !issue?.done,
    },
  });
  revalidatePath("/");
}

export async function createComment(formData: FormData) {
  const parsedData = z
    .object({
      id: z.string(),
      content: z.string(),
    })
    .safeParse({
      id: formData.get("id"),
      content: formData.get("content"),
    });
  const session = await getAuthSession();
  if (parsedData.success && session) {
    await db.comment.create({
      data: {
        userId: session.user.id,
        content: parsedData.data.content,
        issueId: parsedData.data.id,
      },
    });
  }
  revalidatePath("/");
}
