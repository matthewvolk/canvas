import { Suspense } from "react";

async function Time() {
  const response = await fetch(
    "https://timeapi.io/api/time/current/zone?timeZone=America%2FChicago",
    {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 60,
      },
    },
  );

  console.dir(response.body, { depth: null });

  const data = await response.json();

  console.dir(data, { depth: null });

  return <p>{data.dateTime}</p>;
}

export default function Home() {
  return (
    <Suspense
      fallback={<section className="flex min-h-screen bg-red-600"></section>}
    >
      <Time />
    </Suspense>
  );
}
