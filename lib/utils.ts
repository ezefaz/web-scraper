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
	const lowestPrice = getLowestPrice(currentProduct.priceHistory);

	if (scrapedProduct.currentPrice < lowestPrice) {
		return Notification.LOWEST_PRICE as keyof typeof Notification;
	}
	if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
		return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
	}
	if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
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

export const getCurrentWeekDolarData = (
	dolarHistory: Array<any>,
	currentPrice: Number
) => {
	const currentDate: any = new Date();
	const currentWeekDolarData = [];

	for (let i = 0; i < dolarHistory.length; i++) {
		const dolarDate = new Date(dolarHistory[i].date);
		const diffTime = Math.abs(currentDate - Number(dolarDate));
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		let formattedDolarPrice = dolarHistory[i].value;
		if (formattedDolarPrice < 9) {
			formattedDolarPrice *= 1000;
		}

		const updatedDolarPrice = Number(currentPrice) / formattedDolarPrice;
		if (diffDays <= 7) {
			currentWeekDolarData.push({
				Date: formatDay(new Date(dolarDate)),
				"Valor Producto": updatedDolarPrice,
				"Valor Dólar": formattedDolarPrice,
			});
		}
	}

	return currentWeekDolarData;
};

export const getCurrentMonthlyDolarData = (
	dolarHistory: Array<any>,
	currentPrice: number
) => {
	const currentDate: any = new Date();
	const currentMonthDolarData: any[] = [];

	for (let i = 0; i < dolarHistory.length; i++) {
		const dolarDate = new Date(dolarHistory[i].date);
		const diffTime = Math.abs(currentDate - Number(dolarDate));
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const formattedDolarPrice =
			dolarHistory[i].value < 9
				? dolarHistory[i].value * 1000
				: dolarHistory[i].value;

		const updatedProductValue = Number(currentPrice) / formattedDolarPrice;

		if (diffDays <= 30) {
			currentMonthDolarData.push({
				Date: formatDay(new Date(dolarDate)),
				"Valor Producto": updatedProductValue,
				"Valor Dólar": formattedDolarPrice,
			});
		}
	}

	return currentMonthDolarData;
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
	const monthlyDataMap = new Map<number, { highestPrice: number }>();
	let productValue = 0;
	let annualData: any = [];

	for (const priceItem of dolarPriceHistory) {
		const currentDate = priceItem.date;
		const currentDolarValue = priceItem.value;
		const formattedDolarValue =
			currentDolarValue < 9 ? currentDolarValue * 1000 : currentDolarValue;

		if (!monthlyDataMap.has(currentDate.getMonth())) {
			monthlyDataMap.set(currentDate.getMonth(), { highestPrice: -Infinity });
		}

		const monthData = monthlyDataMap.get(currentDate.getMonth());

		if (monthData) {
			monthData.highestPrice = Math.max(
				monthData.highestPrice,
				formattedDolarValue
			);
		}

		productValue = currentPrice / Number(formattedDolarValue);

		const formattedDate = currentDate.toLocaleDateString("es-AR", {
			year: "numeric",
			month: "long",
		});

		annualData.push({
			Date: formattedDate,
			"Valor Producto": productValue,
			"Valor Dólar": formattedDolarValue,
		});
	}

	return annualData;
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
	const weeklyDataMap = new Map();

	// Iterate through the price history array
	for (const { date, price } of priceHistory) {
		const currentWeekStart = getStartOfWeekSunday(new Date());
		const currentWeekEnd = new Date(currentWeekStart);
		currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

		const currentDate = new Date(date);

		// Check if the date is within the current week (Sunday to Saturday)
		if (currentDate >= currentWeekStart && currentDate <= currentWeekEnd) {
			const formattedDate = formatDate(currentDate);

			// If the date is not already in the map, add it
			if (!weeklyDataMap.has(formattedDate)) {
				weeklyDataMap.set(formattedDate, {
					highestPrice: -Infinity,
					lowestPrice: Infinity,
				});
			}

			// Update highest and lowest prices for the date
			const { highestPrice, lowestPrice } = weeklyDataMap.get(formattedDate);
			weeklyDataMap.set(formattedDate, {
				highestPrice: Math.max(highestPrice, price),
				lowestPrice: Math.min(lowestPrice, price),
			});
		}
	}

	// Convert the map to the desired array format
	const weeklyData = Array.from(
		weeklyDataMap,
		([Month, { highestPrice, lowestPrice }]) => ({
			Month,
			Mayor: highestPrice,
			Menor: lowestPrice,
		})
	);

	return weeklyData;
}

function getStartOfWeekSunday(date: Date) {
	const dayOfWeek = date.getDay();
	const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? 0 : 0);
	return new Date(date.setDate(diff));
}

function formatDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export const getMonthlyData = (
	priceHistory: PriceHistoryItem[],
	currency: string
): MonthlyData[] => {
	const monthlyDataMap = new Map<
		string,
		{ lowestPrice: number; highestPrice: number }
	>();

	for (const priceItem of priceHistory) {
		const yearMonthDay = priceItem.date.toISOString();

		if (!monthlyDataMap.has(yearMonthDay)) {
			monthlyDataMap.set(yearMonthDay, {
				lowestPrice: Infinity,
				highestPrice: -Infinity,
			});
		}

		const dayData = monthlyDataMap.get(yearMonthDay);

		if (dayData) {
			dayData.lowestPrice = Math.min(dayData.lowestPrice, priceItem.price);
			dayData.highestPrice = Math.max(dayData.highestPrice, priceItem.price);
		}
	}

	const monthlyData: MonthlyData[] = [];

	monthlyDataMap.forEach((data, day) => {
		monthlyData.push({
			Month: formatDay(new Date(day)),
			Mayor: data.highestPrice,
			Menor: data.lowestPrice,
		});
	});

	return monthlyData;
};

export const getAnnualMonthlyData = (
	priceHistory: PriceHistoryItem[],
	currency: string
): MonthlyData[] => {
	const monthlyDataMap = new Map<
		number,
		{ lowestPrice: number; highestPrice: number }
	>();

	for (const priceItem of priceHistory) {
		const yearMonth = priceItem.date.getMonth() + 1;

		if (!monthlyDataMap.has(yearMonth)) {
			monthlyDataMap.set(yearMonth, {
				lowestPrice: Infinity,
				highestPrice: -Infinity,
			});
		}

		const monthData = monthlyDataMap.get(yearMonth);

		if (monthData) {
			monthData.lowestPrice = Math.min(monthData.lowestPrice, priceItem.price);
			monthData.highestPrice = Math.max(
				monthData.highestPrice,
				priceItem.price
			);
		}
	}

	const monthlyData: MonthlyData[] = [];

	monthlyDataMap.forEach((data, month) => {
		monthlyData.push({
			Month: formatMonth(new Date(`2024-${month}-01`)),
			Mayor: data.highestPrice,
			Menor: data.lowestPrice,
		});
	});

	return monthlyData;
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
