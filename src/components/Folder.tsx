import Link from "next/link";

import { ArchiveIcon } from "@radix-ui/react-icons";

export default function Folder({
  path,
  title,
}: {
  path: string;
  title: string;
}) {
  return (
    <Link href={path} className="w-full">
      <div className="flex w-full flex-row items-center justify-start gap-2 rounded-sm p-2 hover:bg-muted">
        <ArchiveIcon />
        <p className="text-lg font-bold leading-normal">{title}</p>
      </div>
    </Link>
  );
}
