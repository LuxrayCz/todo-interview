import CreateTodo from "@/components/CreateTodo";
import { getAuthSession } from "@/lib/auth";
import db from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import { formatDistance } from "date-fns";
import { DataTable } from "@/components/TodoTable/DataTable";
import { column } from "@/components/TodoTable/column";
import { duration } from "@/lib/helper";

export const TAKE_TODOS = 5;

async function getTodos(page: string | string[] | undefined) {
  "use server";
  const session = await getAuthSession();
  const pageNumber = page && typeof page === "string" ? parseInt(page) : page ? parseInt(page[0]) : 1;
  const todos = await db.issue.findMany({
    where: {
      userId: session?.user.id,
    },
    skip: (pageNumber - 1) * TAKE_TODOS,
    take: TAKE_TODOS,
    include: {
      comments: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return todos;
}

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const session = await getAuthSession();
  if (!session || !session.user) return redirect("/register");
  const page = searchParams.page;
  const todos = await getTodos(page);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className="container mx-auto">
        <CreateTodo />
        <DataTable columns={column} data={todos} />
      </div>
    </main>
  );
}
