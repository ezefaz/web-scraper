import { PriceHistoryItem, ProductType } from "@/types";

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

// Extracts and returns the currency symbol from an element.
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
	// these are possible elements holding description of the product
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

	// If no matching elements were found, return an empty string
	return "";
}

export function extractStarRatings($: any) {
	// these are possible elements holding description of the product
	const selectors = [
		".ui-pdp-review__rating",
		".ui-review-capability__rating__average.ui-review-capability__rating__average--desktop",
	];

	for (const selector of selectors) {
		const elements = $(selector);
		if (elements.length > 0) {
			const textContent = elements.map((_: any, element: any) =>
				$(element).text()
			);
			return textContent;
		}
	}

	// If no matching elements were found, return an empty string
	return "";
}

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

		if (diffDays <= 7) {
			currentWeekDolarData.push({
				date: dolarDate.toISOString(),
				"Valor Real del Producto": Number(currentPrice) / formattedDolarPrice,
				"Valor del Dólar": formattedDolarPrice,
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

		if (diffDays <= 30) {
			currentMonthDolarData.push({
				date: dolarDate.toISOString(),
				"Valor Real del Producto": Number(currentPrice) / formattedDolarPrice,
				"Valor del Dólar": formattedDolarPrice,
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

		if (
			currentDate.toISOString().slice(0, 10) ===
			dolarDate.toISOString().slice(0, 10)
		) {
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
			date: formattedDate,
			"Valor Real del Producto": productValue,
			"Valor del Dólar": formattedDolarValue,
			// 'Máximo Valor del Dólar': maxDolarValue,
			// 'Mínimo Valor del Dólar': minDolarValue,
		});
	}
	return dailyData;
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
				date: currentDolarDate.toISOString().slice(0, 10),
				"Valor Real del Producto": realProductValue,
				"Valor del Dólar": currentDolarValue,
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
			date: key,
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

export const getWeeklyData = (
	priceAndDateHistory: Array<any>,
	currentPrice: Number,
	originalPrice: Number
) => {
	const today = new Date();
	const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
	const weeklyData: Array<any> = [];

	for (let i = 0; i < priceAndDateHistory.length; i++) {
		const currentDate = new Date(priceAndDateHistory[i].date);
		if (currentDate > sevenDaysAgo && currentDate <= today) {
			const maxPrice =
				originalPrice > priceAndDateHistory[i].price
					? originalPrice
					: priceAndDateHistory[i].price;
			const minPrice =
				currentPrice < priceAndDateHistory[i].price
					? currentPrice
					: priceAndDateHistory[i].price;

			weeklyData.push({
				mes: currentDate.toLocaleDateString("es-AR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}),
				"Precios Mayores": maxPrice,
				"Precios Menores": minPrice,
				Variación: maxPrice - minPrice,
			});
		}
	}

	return weeklyData;
};

// export const getMonthlyData = (
//   filteredPrices: Array<any>,
//   monthsFromDates: Array<string>,
//   originalPrice: Number,
//   currentPrice: Number
// ) => {
//   const lastThreeMonths = getLastThreeMonths();
//   return lastThreeMonths.map((month) => {
//     const filteredMonthPrices = filteredPrices.filter((price, index) => {
//       return monthsFromDates[index] === month && typeof price === 'number' && !Number.isNaN(price);
//     });

//     // Remove duplicate prices using a Set
//     const uniquePrices = new Set(filteredMonthPrices);

//     // Convert the unique prices back to an array
//     const uniquePricesArray: Array<any> = Array.from(uniquePrices);

//     let maxPrice = 0;
//     let minPrice = 0;

//     if (uniquePricesArray.length > 0) {
//       maxPrice = Math.max(...uniquePricesArray);
//       minPrice = Math.min(...uniquePricesArray);
//     }

//     const variation = Number(maxPrice) - Number(minPrice);

//     if (uniquePricesArray.length === 0) {
//       maxPrice = Number(originalPrice);
//       minPrice = Number(currentPrice);
//     } else {
//       maxPrice = maxPrice > Number(currentPrice) ? Number(currentPrice) : maxPrice;
//       minPrice = minPrice > Number(originalPrice) ? Number(originalPrice) : minPrice;
//     }

//     return {
//       mes: month.charAt(0).toUpperCase() + month.slice(1),
//       'Precios Mayores': maxPrice > Number(currentPrice) ? currentPrice : maxPrice,
//       'Precios Menores': minPrice > Number(originalPrice) ? originalPrice : minPrice,
//       Variación: variation,
//     };
//   });
// };

export const getMonthlyData = (
	priceAndDateHistory: Array<any>,
	currentPrice: Number,
	originalPrice: Number
) => {
	const today = new Date();
	const currentMonth = today.getMonth();
	const monthlyData: any = {};

	for (let i = 0; i < priceAndDateHistory.length; i++) {
		const currentDate = new Date(priceAndDateHistory[i].date);
		const currentMonthIndex = currentDate.getMonth();
		const currentPriceItem = priceAndDateHistory[i].price;

		if (currentMonthIndex === currentMonth) {
			monthlyData[currentMonth] = {
				maxPrice: originalPrice,
				minPrice: currentPrice,
			};
		} else if (currentMonthIndex < currentMonth) {
			if (!monthlyData[currentMonthIndex]) {
				monthlyData[currentMonthIndex] = {
					maxPrice: currentPriceItem,
					minPrice: currentPriceItem,
				};
			} else {
				monthlyData[currentMonthIndex].maxPrice = Math.max(
					monthlyData[currentMonthIndex].maxPrice,
					currentPriceItem,
					Number(originalPrice)
				);
				monthlyData[currentMonthIndex].minPrice = Math.min(
					monthlyData[currentMonthIndex].minPrice,
					currentPriceItem,
					Number(originalPrice)
				);
			}
		}
	}

	const result = Object.keys(monthlyData).map((monthIndex: any) => {
		const month = new Date(today.getFullYear(), monthIndex, 1).toLocaleString(
			"default",
			{ month: "long" }
		);
		const { maxPrice, minPrice } = monthlyData[monthIndex];
		const variation = maxPrice - minPrice;
		return {
			month: month.charAt(0).toUpperCase() + month.slice(1),
			"Precios Mayores": maxPrice,
			"Precio Menores": minPrice,
			Variación: variation,
		};
	});

	return result;
};
