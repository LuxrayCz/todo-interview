"use client";
import { changeStatus, createComment } from "@/actions/todos";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { duration } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";
import { differenceInSeconds, format } from "date-fns";
import { BadgeAlert, BadgeCheck } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export type data = {
  name: string;
  estimatedTimeInSec: number;
  done: boolean;
  createdAt: Date;
  uuid: string;
  description: string | null;
  comments: Comment2[];
  updatedAt: Date;
};

export const column: ColumnDef<data>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center text-black">Name</div>,
  },
  {
    accessorKey: "estimatedTimeInSec",
    header: () => <div className="text-center text-black px-6">Estimated time</div>,
    cell: (cellData) => {
      return <>{duration(cellData.row.getValue("estimatedTimeInSec"))}</>;
    },
  },
  {
    accessorKey: "done",
    header: () => <div className="text-center text-black px-5">Status</div>,
    cell: (cellData) => {
      const issue = cellData.row.original;
      return (
        <>
          {cellData.row.getValue("done") ? (
            <div>
              <p>Done</p>
              <p>in {duration(differenceInSeconds(issue.updatedAt, issue.createdAt))}</p>
            </div>
          ) : (
            <div>Todo</div>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <div className="text-center text-black px-6">Created at</div>,
    cell: (cellData) => {
      return <>{format(new Date(cellData.row.getValue("createdAt")), " d.M. H:mm")}</>;
    },
  },
  {
    accessorKey: "uuid",
    header: ({ column }) => <div className="text-center text-black px-6"></div>,
    cell: (cellData) => {
      const issue = cellData.row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button>View</Button>
          </DialogTrigger>
          <DialogContent className="overflow-auto max-h-[95vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl">{issue.name}</DialogTitle>
              <DialogDescription className="text-lg">{issue.description}</DialogDescription>
              {/* MARK AS DONE/TODO */}
              <Button
                onClick={async () => {
                  changeStatus(issue.uuid);
                }}
                className="max-w-[30%] min-w-[100px]"
                variant={"outline"}
              >
                {issue.done ? (
                  <span className="flex gap-x-1 items-center">
                    <BadgeAlert />
                    Mark as todo
                  </span>
                ) : (
                  <span className="flex items-center gap-x-1">
                    <BadgeCheck />
                    Mark as done
                  </span>
                )}
              </Button>
              {/* ALL COMENTS */}
              <div>
                {issue.comments &&
                  issue.comments.length > 0 &&
                  issue.comments.map((comment) => (
                    <div key={comment.uuid} className="mt-2">
                      <div className="flex justify-between">
                        <h5 className="text-lg font-semibold">{comment.user.email}</h5>
                        <span>{format(new Date(comment.createdAt), " d.M. H:mm")}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
              </div>
              {/* CREATE COMMENT */}
              <form action={createComment} className="space-y-3">
                <input type="hidden" name="id" value={issue.uuid} />
                <Textarea required={true} name="content" />
                <Button type="submit">Comment</Button>
              </form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
