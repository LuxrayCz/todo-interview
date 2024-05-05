import { createTodo } from "@/actions/todos";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const CreateTodo = () => {
  return (
    <div className="border p-4 bg-gray-100 rounded-md mt-16 min-w-[300px] max-w-[400px]">
      <h1 className="text-4xl font-bold">Create todo:</h1>
      <form action={createTodo} className="space-y-3">
        <div>
          <label htmlFor="name">Name:</label>
          <Input id="name" name="name" required={true} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Estimated time:</h3>
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              Hours:
              <Input name="hours" type={"number"} min={0} defaultValue={0} />
            </div>
            <div className="flex-1">
              Minutes:
              <Input name="minutes" type={"number"} min={0} defaultValue={0} max={59} />
            </div>
            <div className="flex-1">
              Seconds:
              <Input name="seconds" type={"number"} min={1} defaultValue={1} max={59} />
            </div>
          </div>
        </div>
        <Button type="submit">Create todo</Button>
      </form>
    </div>
  );
};

export default CreateTodo;
