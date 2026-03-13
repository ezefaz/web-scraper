import { MonthlyData, PriceHistoryItem, ProductType } from "@/types";

const Notification = {
	WELCOME: "WELCOME",
	CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
	LOWEST_PRICE: "LOWEST_PRICE",
	THRESHOLD_MET: "THRESHOLD_MET",
};

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
	for (const element of elements) {
		const priceText = element.text().trim();

		if (priceText) {
			const cleanPrice = priceText.replace(/[^\d.]/g, "");

			let firstPrice;

			if (cleanPrice) {
				firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
			}

			return firstPrice || cleanPrice;
		}
	}

	return "";
}

export function extractCategories(...elements: any) {
	for (const element of elements) {
		if (element && element.text) {
			const categoryText = element.text().trim();
			if (categoryText) {
				const splitBySpace = categoryText.split(/\s+/);
				let category: Array<string> = [];
				splitBySpace.forEach((word: string) => {
					category = category.concat(word.split(/(?=[A-Z])/));
				});
				return category;
			}
		}
	}

	return [];
}

export function extractCurrency(element: any) {
	const currencyText = element.text().trim().slice(0, 1);
	return currencyText ? currencyText : "";
}

export function extractCategory($: any) {
	const elements = [
		$(".andes-breadcrumb .andes-breadcrumb__link"),
		// $('.andes-breadcrumb__link').attr('title'),
		// $('.andes-breadcrumb__item a'),
		// $('.ui-vpp-text-alignment--left .highlighted-specs-title'),
	];
	const categories = elements.map((element) => {
		if (element && element.text) {
			const categoryText = element.text().trim();
			if (categoryText) {
				const words = categoryText.split(/(?=[A-Z])/);
				const lastWord = words[words.length - 1];
				return lastWord;
			}
		}
		return null;
	});
	return categories.filter(Boolean);
}

export function extractDescription($: any) {
	const selectors = [
		".ui-pdp-description__content",
		".ui-pdp-description",
		".ui-pdp-description br",
	];

	for (const selector of selectors) {
		const elements = $(selector);
		if (elements.length > 0) {
			const textContent = elements
				.map((_: any, element: any) => $(element).text().trim())
				.get()
				.join("\n");
			return textContent;
		}
	}

	return "";
}
export function extractStars($: any) {
	const selectors = [
		".ui-review-capability__rating > div > p",
		"..ui-review-capability__rating__rating .andes-visually-hidden",
		".ui-review-capability__rating__average ui-review-capability__rating__average--desktop",
	];

	for (const selector of selectors) {
		const elements = $(selector);
		if (elements.length > 0) {
			const textContent = elements
				.map((_: any, element: any) => $(element).text().trim())
				.get()
				.join("\n");
			return textContent;
		}
	}

	return "";
}

// export function extractStarRatings($: any) {
//   const selectors = [
//     '.ui-review-capability__rating__average ui-review-capability__rating__average--desktop',
//     '.ui-pdp-review__rating',
//     '.ui-pdp-review__amount',
//   ];

//   selectors.text()

//   return '';
// }

export function getHighestPrice(priceList: PriceHistoryItem[]) {
	if (priceList.length === 0 || !priceList[0].price) {
		return 0;
	}

	let highestPrice = priceList[0];

	for (let i = 0; i < priceList.length; i++) {
		if (priceList[i].price > highestPrice.price) {
			highestPrice = priceList[i];
		}
	}

	return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
	if (priceList.length === 0 || !priceList[0].price) {
		return 0;
	}

	let lowestPrice = priceList[0];

	for (let i = 0; i < priceList.length; i++) {
		if (priceList[i].price < lowestPrice.price) {
			lowestPrice = priceList[i];
		}
	}

	return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
	if (priceList.length === 0 || !priceList[0].price) {
		return 0;
	}

	const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
	const averagePrice = sumOfPrices / priceList.length || 0;

	return averagePrice;
}

export const getEmailNotifType = (
	scrapedProduct: ProductType,
	currentProduct: ProductType
) => {
	const lowestPrice = getLowestPrice(currentProduct.priceHistory || []);
	const currentDiscountRate = Number(currentProduct.discountRate || 0);
	const nextDiscountRate = Number(scrapedProduct.discountRate || 0);

	if (scrapedProduct.currentPrice < lowestPrice) {
		return Notification.LOWEST_PRICE as keyof typeof Notification;
	}
	if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
		return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
	}
	if (
		nextDiscountRate >= THRESHOLD_PERCENTAGE &&
		currentDiscountRate < THRESHOLD_PERCENTAGE
	) {
		return Notification.THRESHOLD_MET as keyof typeof Notification;
	}

	return null;
};

export const formatNumber = (num: number = 0) => {
	return num.toLocaleString(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};

export function formatNumberWithCommas(num: number = 0) {
	// Convert the number to a string
	const numStr = num.toString();

	// Split the string into integer and decimal parts
	const [integerPart, decimalPart] = numStr.split(".");

	// Add commas for thousands separators to the integer part
	const formattedIntegerPart = integerPart.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		","
	);

	// Combine the formatted integer part with the decimal part, removing trailing zeros
	const formattedDecimalPart = decimalPart ? `.${decimalPart}` : "";
	const formattedNumber = `${formattedIntegerPart}${formattedDecimalPart}`;

	return formattedNumber;
}

export const getLastThreeMonths = () => {
	const months = [
		"enero",
		"febrero",
		"marzo",
		"abril",
		"mayo",
		"junio",
		"julio",
		"agosto",
		"septiembre",
		"octubre",
		"noviembre",
		"diciembre",
	];
	const today = new Date();
	const currentMonth = today.getMonth();

	const lastFourMonths = [];
	for (let i = 2; i >= 0; i--) {
		lastFourMonths.push(months[(currentMonth - i + 12) % 12]);
	}
	return lastFourMonths;
};

export function formatUSD(price: number) {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	});
	return formatter.format(price);
}

export const extractMonthsFromDate = (
	dateArray: Array<Date | string>
): string[] => {
	return dateArray.map((date) => {
		const parsedDate = typeof date === "string" ? new Date(date) : date;
		const monthName = parsedDate.toLocaleString("es-AR", { month: "long" });
		return monthName;
	});
};

export const getMonthName = (dateString: any) => {
	const date = new Date(dateString);
	const monthNames = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];
	return monthNames[date.getMonth()];
};

export const isSameWeek = (date1: Date, date2: Date) => {
	const oneDay = 24 * 60 * 60 * 1000;
	const firstDay = new Date(
		date1.getFullYear(),
		date1.getMonth(),
		date1.getDate() - date1.getDay()
	);
	const secondDay = new Date(
		date2.getFullYear(),
		date2.getMonth(),
		date2.getDate() - date2.getDay()
	);
	return (
		Math.round(Math.abs((firstDay.getTime() - secondDay.getTime()) / oneDay)) <
		7
	);
};

export function getWeekFromDate(dateString: string) {
	const date: any = new Date(dateString);
	const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// DOLAR FUNCTIONS

const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (value: Date | string) => {
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
};

const toDayKey = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
		2,
		"0"
	)}-${String(date.getDate()).padStart(2, "0")}`;

const toMonthKey = (date: Date) =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const formatDayLabel = (date: Date) =>
	new Intl.DateTimeFormat("es-AR", {
		day: "2-digit",
		month: "short",
	}).format(date);

const formatMonthLabel = (date: Date) =>
	new Intl.DateTimeFormat("es-AR", {
		month: "short",
		year: "numeric",
	}).format(date);

const normalizePriceHistory = (priceHistory: PriceHistoryItem[] = []) =>
	priceHistory
		.map((item) => ({
			date: toDate(item.date),
			price: Number(item.price),
		}))
		.filter(
			(item): item is { date: Date; price: number } =>
				Boolean(item.date) && Number.isFinite(item.price) && item.price > 0
		)
		.sort((a, b) => a.date.getTime() - b.date.getTime());

const normalizeDolarValue = (value: number) => {
	if (!Number.isFinite(value) || value <= 0) return null;
	return value < 20 ? value * 1000 : value;
};

const normalizeDolarHistory = (dolarHistory: Array<any> = []) =>
	dolarHistory
		.map((item) => {
			const date = toDate(item?.date);
			const normalizedValue = normalizeDolarValue(Number(item?.value));
			return { date, value: normalizedValue };
		})
		.filter((item) => Boolean(item.date) && item.value !== null)
		.map((item) => ({ date: item.date as Date, value: item.value as number }))
		.sort((a, b) => a.date.getTime() - b.date.getTime());

export const getCurrentWeekDolarData = (
	dolarHistory: Array<any>,
	currentPrice: Number
) => {
	const numericPrice = Number(currentPrice);
	if (!Number.isFinite(numericPrice) || numericPrice <= 0) return [];

	const normalized = normalizeDolarHistory(dolarHistory);
	if (!normalized.length) return [];

	const latestDate = normalized[normalized.length - 1].date;
	const minDate = new Date(latestDate.getTime() - 6 * DAY_MS);
	const byDay = new Map<string, { date: Date; values: number[] }>();

	for (const item of normalized) {
		if (item.date < minDate) continue;
		const key = toDayKey(item.date);
		if (!byDay.has(key)) byDay.set(key, { date: item.date, values: [] });
		byDay.get(key)!.values.push(item.value);
	}

	return Array.from(byDay.values())
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map((item) => {
			const dolarAvg =
				item.values.reduce((acc, current) => acc + current, 0) /
				item.values.length;
			return {
				Period: formatDayLabel(item.date),
				"Valor Producto USD": numericPrice / dolarAvg,
				"Dólar ARS": dolarAvg,
			};
		});
};

export const getCurrentMonthlyDolarData = (
	dolarHistory: Array<any>,
	currentPrice: number
) => {
	const numericPrice = Number(currentPrice);
	if (!Number.isFinite(numericPrice) || numericPrice <= 0) return [];

	const normalized = normalizeDolarHistory(dolarHistory);
	if (!normalized.length) return [];

	const latestDate = normalized[normalized.length - 1].date;
	const minDate = new Date(latestDate.getTime() - 29 * DAY_MS);
	const byDay = new Map<string, { date: Date; values: number[] }>();

	for (const item of normalized) {
		if (item.date < minDate) continue;
		const key = toDayKey(item.date);
		if (!byDay.has(key)) byDay.set(key, { date: item.date, values: [] });
		byDay.get(key)!.values.push(item.value);
	}

	return Array.from(byDay.values())
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map((item) => {
			const dolarAvg =
				item.values.reduce((acc, current) => acc + current, 0) /
				item.values.length;
			return {
				Period: formatDayLabel(item.date),
				"Valor Producto USD": numericPrice / dolarAvg,
				"Dólar ARS": dolarAvg,
			};
		});
};

export const getDailyDolarData = (
	currentPrice: number,
	dolarValue: number,
	dolarDate: Date,
	dolarValues: any[],
	dolarDates: Array<Date>
) => {
	let maxDolarValue = -Infinity;
	let minDolarValue = Infinity;
	let productValue = 0;
	let dailyData: any = [];

	for (let i = 0; i < dolarDates.length; i++) {
		const currentDate = dolarDates[i];
		const currentDolarValue = dolarValues[i] ? dolarValues[i] : dolarValue;
		const formattedDolarValue =
			currentDolarValue < 9 ? currentDolarValue * 1000 : currentDolarValue;

		if (currentDate.toISOString() === dolarDate.toISOString()) {
			if (formattedDolarValue > maxDolarValue) {
				maxDolarValue = formattedDolarValue;
			}
			if (formattedDolarValue < minDolarValue) {
				minDolarValue = formattedDolarValue;
			}
		}

		productValue = currentPrice / Number(formattedDolarValue);

		const formattedDate = dolarDate.toLocaleDateString("es-AR", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});

		dailyData.push({
			Date: formatDay(new Date(dolarDate)),
			"Valor Producto": productValue,
			"Valor Dólar": formattedDolarValue,
		});
	}
	return dailyData;
};

interface DolarPriceHistoryItem {
	value: number;
	date: Date;
	_id: any;
}

export const getAnnualDolarData = (
	currentPrice: number,
	dolarPriceHistory: DolarPriceHistoryItem[]
) => {
	const numericPrice = Number(currentPrice);
	if (!Number.isFinite(numericPrice) || numericPrice <= 0) return [];

	const normalized = normalizeDolarHistory(dolarPriceHistory);
	if (!normalized.length) return [];

	const latestDate = normalized[normalized.length - 1].date;
	const minDate = new Date(latestDate);
	minDate.setMonth(minDate.getMonth() - 11);
	const byMonth = new Map<string, { date: Date; values: number[] }>();

	for (const item of normalized) {
		if (item.date < minDate) continue;
		const key = toMonthKey(item.date);
		if (!byMonth.has(key)) byMonth.set(key, { date: item.date, values: [] });
		byMonth.get(key)!.values.push(item.value);
	}

	return Array.from(byMonth.values())
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map((item) => {
			const dolarAvg =
				item.values.reduce((acc, current) => acc + current, 0) /
				item.values.length;
			return {
				Period: formatMonthLabel(item.date),
				"Valor Producto USD": numericPrice / dolarAvg,
				"Dólar ARS": dolarAvg,
			};
		});
};

export const getCurrentWeekData = (
	currentPrice: number,
	dolarValue: number,
	dolarDate: Date,
	dolarValues: Array<any>,
	dolarDates: Array<Date>
) => {
	const weeklyData = [];
	const thisSunday = new Date();

	thisSunday.setDate(thisSunday.getDate() - thisSunday.getDay());
	const nextSunday = new Date();
	nextSunday.setDate(thisSunday.getDate() + 6);

	for (let i = 0; i < dolarDates.length; i++) {
		const currentDolarDate = new Date(dolarDates[i]);
		const currentDolarValue = dolarValues[i] ? dolarValues[i] : dolarValue;

		const realProductValue = currentPrice / currentDolarValue;

		if (currentDolarDate >= thisSunday && currentDolarDate <= nextSunday) {
			weeklyData.push({
				Date: currentDolarDate,
				Producto: realProductValue,
				Valor: currentDolarValue,
			});
		}
	}

	return weeklyData;
};

export const getMonthlyRealData = (
	dolarDates: Array<Date | string>,
	dolarValues: any[],
	currentPrice: number
) => {
	const monthlyData: any = [];
	const monthlyMonths = extractMonthsFromDate(dolarDates);

	// Create a map of months to their corresponding values
	const monthlyMap = new Map<string, number>();
	dolarDates.forEach((date, index) => {
		const currentMonth = extractMonthsFromDate([date])[0];
		if (
			!monthlyMap.has(currentMonth) ||
			dolarValues[index] < monthlyMap.get(currentMonth)!
		) {
			monthlyMap.set(currentMonth, dolarValues[index]);
		}
	});

	monthlyMap.forEach((value, key) => {
		monthlyData.push({
			Date: key,
			"Valor Real del Producto": currentPrice / value,
			"Valor del Dólar": value,
		});
	});

	return monthlyData;
};

export const comparePrices = (price1: number, price2: number) => {
	let mayores, menores;
	if (price1 > price2) {
		mayores = Number(price1);
		menores = Number(price2);
	} else {
		mayores = Number(price2);
		menores = Number(price1);
	}
	return {
		mayores: mayores,
		menores: menores,
	};
};

export const getDailyData = (currentPrice: Number, originalPrice: Number) => {
	let dailyData = [];

	const formattedDate = new Date().toLocaleDateString("es-AR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	dailyData.push({
		mes: formattedDate,
		"Precios Mayores": originalPrice,
		"Precios Menores": currentPrice,
		Variación:
			originalPrice > currentPrice
				? Number(originalPrice) - Number(currentPrice)
				: Number(currentPrice) - Number(originalPrice),
		// 'Máximo Precio Original': maxOriginalPrice,
		// 'Mínimo Precio Original': minOriginalPrice,
	});

	return dailyData;
};

export function getWeeklyData(priceHistory: any) {
	const normalized = normalizePriceHistory(priceHistory);
	if (!normalized.length) return [];

	const latestDate = normalized[normalized.length - 1].date;
	const minDate = new Date(latestDate.getTime() - 6 * DAY_MS);
	const byDay = new Map<string, { date: Date; lowest: number; highest: number }>();

	for (const item of normalized) {
		if (item.date < minDate) continue;
		const key = toDayKey(item.date);
		if (!byDay.has(key)) {
			byDay.set(key, {
				date: item.date,
				lowest: item.price,
				highest: item.price,
			});
			continue;
		}
		const current = byDay.get(key)!;
		current.lowest = Math.min(current.lowest, item.price);
		current.highest = Math.max(current.highest, item.price);
	}

	return Array.from(byDay.values())
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map((item) => ({
			Period: formatDayLabel(item.date),
			Mayor: item.highest,
			Menor: item.lowest,
		}));
}

export const getMonthlyData = (
	priceHistory: PriceHistoryItem[],
	currency: string
): MonthlyData[] => {
	const normalized = normalizePriceHistory(priceHistory);
	if (!normalized.length) return [];

	const latestDate = normalized[normalized.length - 1].date;
	const minDate = new Date(latestDate.getTime() - 29 * DAY_MS);
	const byDay = new Map<string, { date: Date; lowest: number; highest: number }>();

	for (const item of normalized) {
		if (item.date < minDate) continue;
		const key = toDayKey(item.date);
		if (!byDay.has(key)) {
			byDay.set(key, {
				date: item.date,
				lowest: item.price,
				highest: item.price,
			});
			continue;
		}
		const current = byDay.get(key)!;
		current.lowest = Math.min(current.lowest, item.price);
		current.highest = Math.max(current.highest, item.price);
	}

	return Array.from(byDay.values())
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map((item) => ({
			Month: formatDayLabel(item.date),
			Period: formatDayLabel(item.date),
			Mayor: item.highest,
			Menor: item.lowest,
		}));
};

export const getAnnualMonthlyData = (
	priceHistory: PriceHistoryItem[],
	currency: string
): MonthlyData[] => {
	const normalized = normalizePriceHistory(priceHistory);
	if (!normalized.length) return [];

	const latestDate = normalized[normalized.length - 1].date;
	const minDate = new Date(latestDate);
	minDate.setMonth(minDate.getMonth() - 11);
	const byMonth = new Map<string, { date: Date; lowest: number; highest: number }>();

	for (const item of normalized) {
		if (item.date < minDate) continue;
		const key = toMonthKey(item.date);
		if (!byMonth.has(key)) {
			byMonth.set(key, {
				date: item.date,
				lowest: item.price,
				highest: item.price,
			});
			continue;
		}
		const current = byMonth.get(key)!;
		current.lowest = Math.min(current.lowest, item.price);
		current.highest = Math.max(current.highest, item.price);
	}

	return Array.from(byMonth.values())
		.sort((a, b) => a.date.getTime() - b.date.getTime())
		.map((item) => ({
			Month: formatMonthLabel(item.date),
			Period: formatMonthLabel(item.date),
			Mayor: item.highest,
			Menor: item.lowest,
		}));
};

const formatDay = (date: Date) => {
	const options: any = { day: "numeric", month: "long" };
	return date.toLocaleDateString("es-AR", options);
};

const formatMonth = (date: Date) => {
	const options: any = { month: "long" };
	return date.toLocaleDateString("es-AR", options);
};

export const getDiscountPercentage = (
	currentPrice: number,
	originalPrice: number
) => {
	const discountAmount = originalPrice - currentPrice;
	const discountPercentage = (discountAmount / originalPrice) * 100;

	return discountPercentage.toFixed(2);
};
