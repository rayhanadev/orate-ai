import Link from "next/link";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export default function File({
  slug,
  title,
  duration,
  timeCreated,
}: {
  slug: string;
  title: string;
  duration: number;
  timeCreated: Date;
}) {
  const formattedDate = dayjs(timeCreated).utc().fromNow();

  const minutes = Math.floor(duration / 1000 / 60);
  const seconds = Math.floor(duration / 1000) % 60;
  const formattedDuration = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <Link href={`/lectures/${slug}`} className="w-full">
      <div className="flex w-full flex-row items-end justify-between rounded-sm p-2 hover:bg-muted">
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-lg font-bold leading-normal">{title}</p>
          <p className="leading-normal text-muted-foreground">
            {formattedDate}
          </p>
        </div>
        <div className="leading-normal text-muted-foreground">
          {formattedDuration}
        </div>
      </div>
    </Link>
  );
}
