"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

const PaginationButtons = ({ dataLength }: { dataLength: number }) => {
  const router = useRouter();
  const params = useSearchParams();
  const page = params.get("page");
  const pageNumber = page ? parseInt(page) : 1;
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-end space-x-3 py-4 text-black">
      <Button
        className="text-black bg-transparent"
        variant="outline"
        size="sm"
        onClick={() => {
          router.push(`${pathname}?page=${(pageNumber - 1).toString()}`);
        }}
        disabled={pageNumber <= 1}
      >
        Previous
      </Button>
      <Button
        disabled={dataLength < 5}
        className="text-black bg-transparent"
        variant="outline"
        size="sm"
        onClick={() => {
          router.push(`${pathname}?page=${(pageNumber + 1).toString()}`);
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationButtons;
