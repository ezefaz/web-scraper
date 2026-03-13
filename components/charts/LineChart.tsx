"use client";

import { useMemo, useState } from "react";
import { AreaChart, Badge, Card, Tab, TabGroup, TabList, Title } from "@tremor/react";
import { HiOutlineStatusOnline } from "react-icons/hi";

interface DolarTrendItem {
  Period?: string;
  Date?: string;
  "Valor Producto USD": number;
  "Dólar ARS": number;
}

interface Props {
  weeklyData: DolarTrendItem[];
  monthlyData: DolarTrendItem[];
  anualData: DolarTrendItem[];
}

const tabs = [
  { key: "semanal", label: "Semanal" },
  { key: "mensual", label: "Mensual" },
  { key: "anual", label: "Anual" },
] as const;

const DolarBasedChart = ({ weeklyData, monthlyData, anualData }: Props) => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof tabs)[number]["key"]>("semanal");

  const rawData = useMemo(() => {
    if (selectedTab === "mensual") return monthlyData;
    if (selectedTab === "anual") return anualData;
    return weeklyData;
  }, [anualData, monthlyData, selectedTab, weeklyData]);

  const chartData = useMemo(
    () =>
      rawData.map((item) => ({
        Period: item.Period ?? item.Date ?? "",
        "Valor Producto USD": Number(item["Valor Producto USD"]) || 0,
        "Dólar ARS": Number(item["Dólar ARS"]) || 0,
      })),
    [rawData],
  );

  const valueFormatter = (number: number) =>
    new Intl.NumberFormat("es-AR", {
      maximumFractionDigits: 0,
    }).format(number);

  return (
    <Card className="p-4 shadow-md rounded-md w-full h-full">
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
        Valor real del producto (USD) vs dólar ({selectedTab})
      </Title>
      <p className="text-sm text-muted-foreground">
        Seguimiento del impacto del dólar sobre el precio real del producto.
      </p>
      <AreaChart
        data={chartData}
        index="Period"
        categories={["Valor Producto USD", "Dólar ARS"]}
        colors={["emerald", "amber"]}
        valueFormatter={valueFormatter}
        className="h-80 mt-4"
        yAxisWidth={80}
        noDataText="No hay datos suficientes de dólar para este período."
      />
    </Card>
  );
};

export default DolarBasedChart;

