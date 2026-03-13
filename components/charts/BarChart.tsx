"use client";

import { useMemo, useState } from "react";
import { AreaChart, Badge, Card, Tab, TabGroup, TabList, Title } from "@tremor/react";
import { HiOutlineStatusOnline } from "react-icons/hi";

interface TrendItem {
  Period?: string;
  Month?: string;
  Mayor: number | string;
  Menor: number | string;
}

interface Props {
  productTitle: string;
  lowestPrice: number;
  highestPrice: number;
  monthlyData: TrendItem[];
  anualData: TrendItem[];
  weeklyData: TrendItem[];
  currency: string;
}

const tabs = [
  { key: "mensual", label: "Mensual" },
  { key: "semanal", label: "Semanal" },
  { key: "anual", label: "Anual" },
] as const;

const PriceHistoryChart = ({
  productTitle,
  lowestPrice,
  highestPrice,
  monthlyData,
  anualData,
  weeklyData,
  currency,
}: Props) => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]["key"]>("mensual");

  const rawData = useMemo(() => {
    if (selectedTab === "semanal") return weeklyData;
    if (selectedTab === "anual") return anualData;
    return monthlyData;
  }, [anualData, monthlyData, selectedTab, weeklyData]);

  const chartData = useMemo(
    () =>
      rawData.map((item) => ({
        Period: item.Period ?? item.Month ?? "",
        Mayor: Number(item.Mayor) || 0,
        Menor: Number(item.Menor) || 0,
      })),
    [rawData],
  );

  const valueFormatter = (value: number) =>
    `${currency} ${value.toLocaleString("es-AR", {
      maximumFractionDigits: 0,
    })}`;

  return (
    <Card className="p-4 shadow-md rounded-md w-full">
      <TabGroup>
        <TabList className="mt-2">
          {tabs.map((tab) => (
            <Tab key={tab.key} onClick={() => setSelectedTab(tab.key)}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
      </TabGroup>
      <div className="flex justify-end mt-2">
        <Badge icon={HiOutlineStatusOnline}>live</Badge>
      </div>
      <Title className="text-xl md:text-2xl font-semibold mb-1">
        Evolución {selectedTab} de "{productTitle}"
      </Title>
      <p className="text-sm text-muted-foreground">
        Máximo histórico: {valueFormatter(highestPrice)} · Mínimo histórico:{" "}
        {valueFormatter(lowestPrice)}
      </p>
      <AreaChart
        className="mt-4 h-80"
        data={chartData}
        categories={["Mayor", "Menor"]}
        index="Period"
        colors={["rose", "emerald"]}
        yAxisWidth={80}
        minValue={lowestPrice > 0 ? lowestPrice * 0.98 : undefined}
        maxValue={highestPrice > 0 ? highestPrice * 1.02 : undefined}
        valueFormatter={valueFormatter}
        noDataText="No hay datos suficientes del producto aún."
      />
    </Card>
  );
};

export default PriceHistoryChart;
