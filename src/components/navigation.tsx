import Link from "next/link";

import { client, TWO_MINUTES } from "@/lib/bigcommerce/client";
import { graphql } from "@/lib/bigcommerce/graphql";

export async function Navigation() {
  const NavigationQuery = graphql(`
    query NavigationQuery {
      site {
        categoryTree {
          entityId
          name
        }
      }
    }
  `);

  const { data } = await client.fetch({
    document: NavigationQuery,
    fetchOptions: { next: { tags: ["categoryTree"], revalidate: TWO_MINUTES } },
  });

  return (
    <nav className="overflow-scroll rounded-lg border-2 border-dotted border-[#f1c40f] bg-[#fffaeb] p-4 md:px-4 md:py-2">
      <ul className="flex flex-shrink-0 gap-4">
        {data.site.categoryTree.map((category) => (
          <li className="flex-shrink-0" key={category.entityId}>
            <Link href={`/category/${category.entityId}`}>{category.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
