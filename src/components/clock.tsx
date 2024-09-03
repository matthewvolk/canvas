"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <pre
      className="flex w-full items-center justify-center rounded-lg border-2 border-dotted border-neutral-500 bg-neutral-100 p-4 text-xl font-bold lg:text-3xl"
      suppressHydrationWarning
    >
      <span>{time.toLocaleTimeString()}</span>
    </pre>
  );
}
