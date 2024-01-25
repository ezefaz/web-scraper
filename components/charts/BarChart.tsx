"use client";

import React, { useState } from "react";
import {
	comparePrices,
	extractMonthsFromDate,
	getDailyData,
	getLastThreeMonths,
	getLowestPrice,
	getMonthlyData,
} from "@/lib/utils";
import {
	Card,
	Title,
	LineChart,
	Text,
	Flex,
	Metric,
	ProgressBar,
	TabGroup,
	TabList,
	Tab,
	AreaChart,
} from "@tremor/react";
import { Badge, BadgeDelta } from "@tremor/react";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { generateDolarHistory } from "@/lib/faker";
import { DolarHistoryItem } from "@/types";

const priceFormatter = (number: any) =>
	`$${Intl.NumberFormat("us").format(number).toString()}`;

interface Props {
	productTitle: string;
	dateHistory: Array<string | Date>;
	priceHistory: Array<string | number | Number>;
	lowestPrice: number;
	highestPrice: number;
	monthlyData: Array<any>;
	anualData: Array<any>;
	weeklyData: Array<any>;
	currency: string;
}

const LineChartComponent = ({
	productTitle,
	priceHistory,
	dateHistory,
	lowestPrice,
	highestPrice,
	monthlyData,
	currency,
	anualData,
	weeklyData,
}: Props) => {
	const [selectedTab, setSelectedTab] = useState("mensual");
	const lastThreeMonths = getLastThreeMonths();
	const monthsFromDates = extractMonthsFromDate(dateHistory);

	let chartData: any = [];

	if (selectedTab === "semanal") {
		chartData = weeklyData;
	} else if (selectedTab === "mensual") {
		chartData = monthlyData;
	} else if (selectedTab === "anual") {
		chartData = anualData;
	}

	const valueFormatter = (number: number) => {
		return currency + number.toLocaleString("ars");
	};

	return (
		<Card className='p-4 shadow-md rounded-md w-full'>
			<TabGroup>
				<TabList className='mt-8'>
					<Tab onClick={() => setSelectedTab("mensual")}>Mensual</Tab>
					<Tab onClick={() => setSelectedTab("semanal")}>Semanal</Tab>
					<Tab onClick={() => setSelectedTab("anual")}>Anual</Tab>
				</TabList>
			</TabGroup>
			<div className='flex justify-end m-2'>
				<Badge icon={HiOutlineStatusOnline}>live</Badge>
			</div>
			<Title className='text-2xl font-semibold mb-4'>
				Análisis {selectedTab} de "{productTitle}"
			</Title>
			<AreaChart
				className='mt-4 h-80'
				data={chartData}
				categories={["Mayor", "Menor"]}
				index='Month'
				colors={["red", "green"]}
				yAxisWidth={60}
				minValue={lowestPrice}
				maxValue={highestPrice}
				valueFormatter={valueFormatter}
				noDataText='No hay datos suficientes del producto aún.'
			/>
		</Card>
	);
};

export default LineChartComponent;
