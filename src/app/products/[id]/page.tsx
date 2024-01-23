import Image from "next/image";
import { notFound } from "next/navigation";

import { query, graphql } from "@/graphql";

export default async function Product({ params }: { params: { id: string } }) {
  const ProductQuery = graphql(`
    query Product($id: Int!) {
      site {
        product(entityId: $id) {
          name
          id
          defaultImage {
            url(width: 500)
            altText
          }
          description
          prices {
            retailPrice {
              currencyCode
              value
            }
            basePrice {
              value
            }
            salePrice {
              value
            }
            price {
              value
            }
            priceRange {
              min {
                value
              }
              max {
                value
              }
            }
          }
        }
      }
    }
  `);

  const { data } = await query(ProductQuery, {
    id: parseInt(params.id, 10),
  });

  if (!data) {
    throw new Error(`No data in GQL response for Product ID ${params.id}`);
  }

  if (!data.site.product) {
    notFound();
  }

  const { product } = data.site;

  const formatMoney = (maybeNumber?: number) =>
    maybeNumber
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: product.prices?.retailPrice?.currencyCode ?? "USD",
        }).format(maybeNumber)
      : null;

  return (
    <section className="grid grid-cols-2 gap-4">
      <div>
        <Image
          alt={product.defaultImage?.altText ?? ""}
          height={500}
          src={product.defaultImage?.url ?? ""}
          width={500}
        />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>

        <table className="mt-4 text-left [&_th]:pr-4">
          <tbody>
            <tr>
              <th>Retail Price:</th>
              <td>{formatMoney(product.prices?.retailPrice?.value)}</td>
            </tr>
            <tr>
              <th>Base Price:</th>
              <td>{formatMoney(product.prices?.basePrice?.value)}</td>
            </tr>
            <tr>
              <th>Sale Price:</th>
              <td>{formatMoney(product.prices?.salePrice?.value)}</td>
            </tr>
            <tr>
              <th>Price:</th>
              <td>{formatMoney(product.prices?.price.value)}</td>
            </tr>
            <tr>
              <th>Price Range:</th>
              <td>
                {formatMoney(product.prices?.priceRange?.min.value)} -{" "}
                {formatMoney(product.prices?.priceRange?.max.value)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-span-2">
        <h2 className="text-xl font-semibold">Description</h2>
        <p>{product.description}</p>
      </div>
    </section>
  );
}
