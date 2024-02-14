// 'use client';
import { Card } from "@tremor/react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface BusinessProductBadge {
  soldProducts: Array<any>;
  totalProducts: number;
}

export default function BusinessProductBadge({
  soldProducts,
  totalProducts,
}: BusinessProductBadge) {
  const data = [
    {
      name: "Productos",
      stat: totalProducts,
      change: "-12.5%",
      changeType: "negative",
    },
    {
      name: "Vendidos",
      stat: soldProducts.length,
      change: "+1.8%",
      changeType: "positive",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((product: any) => (
          <Card key={product.name}>
            <p className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
              {product.name}
            </p>
            <div className="mt-2 flex products-baseline space-x-2.5">
              <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {product.stat}
              </p>
              <span
                className={classNames(
                  product.changeType === "positive"
                    ? "text-emerald-700 dark:text-emerald-500"
                    : "text-red-700 dark:text-red-500",
                  "text-tremor-default font-medium"
                )}
              >
                {product.change}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
