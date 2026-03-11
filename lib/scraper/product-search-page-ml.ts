"use server";

import axios from "axios";
import * as cheerio from "cheerio";
import { getCurrentUser } from "../actions";
import { getDomainTrustIndex, getTrustLabel } from "./trust-score";

type Country = "argentina" | "uruguay" | "brasil" | "colombia";

type SearchProduct = {
	url: string;
	title: string;
	currentPrice: number;
	originalPrice: number;
	image: string;
	freeShipping: string;
	currency: string;
	features: string;
	isBestSeller: string;
	source: "mercadolibre";
	domain: string;
	trustScore: number;
	trustLabel: "Alta" | "Media" | "Baja";
};

const SEARCH_BASE_BY_COUNTRY: Record<Country, string> = {
	argentina: "https://listado.mercadolibre.com.ar",
	uruguay: "https://listado.mercadolibre.com.uy",
	brasil: "https://lista.mercadolivre.com.br",
	colombia: "https://listado.mercadolibre.com.co",
};

const REQUEST_HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
	Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	"Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
	Referer: "https://www.mercadolibre.com/",
};

const LOG_TAG = "[ML_SEARCH]";
const ML_SEARCH_DEBUG =
	process.env.PRICE_COMPARISON_DEBUG === "true"
	|| process.env.ML_SEARCH_DEBUG === "true";

const logInfo = (requestId: string, message: string, meta?: Record<string, unknown>) => {
	if (!ML_SEARCH_DEBUG) return;
	if (meta) {
		console.log(`${LOG_TAG}[${requestId}] ${message}`, meta);
		return;
	}
	console.log(`${LOG_TAG}[${requestId}] ${message}`);
};

const logError = (requestId: string, message: string, meta?: Record<string, unknown>) => {
	if (!ML_SEARCH_DEBUG) return;
	if (meta) {
		console.error(`${LOG_TAG}[${requestId}] ${message}`, meta);
		return;
	}
	console.error(`${LOG_TAG}[${requestId}] ${message}`);
};

const toHttps = (value: string) => {
	if (!value) return "";
	if (value.startsWith("http://")) return value.replace("http://", "https://");
	if (value.startsWith("//")) return `https:${value}`;
	return value;
};

const normalizeUrl = (value: string) => {
	if (!value) return "";
	try {
		const parsed = new URL(value);
		parsed.hash = "";
		parsed.search = "";
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return value.split("#")[0].split("?")[0];
	}
};

const parsePriceNumber = (value?: string | number) => {
	if (typeof value === "number") return Number.isFinite(value) ? value : 0;
	if (!value) return 0;
	const sanitized = String(value).replace(/[^\d]/g, "");
	if (!sanitized) return 0;
	return Number(sanitized);
};

const getDomainFromUrl = (value: string) => {
	if (!value) return "";
	try {
		return new URL(value).hostname.replace(/^www\./, "");
	} catch {
		return "";
	}
};

const buildTrustMeta = (url: string) => {
	const domain = getDomainFromUrl(url);
	const trustScore = getDomainTrustIndex(domain, "mercadolibre");
	const trustLabel = getTrustLabel(trustScore);
	return { domain, trustScore, trustLabel };
};

const getImageFromSrcset = (srcset?: string) => {
	if (!srcset) return "";
	const firstCandidate = srcset
		.split(",")
		.map((candidate) => candidate.trim())
		.filter(Boolean)[0];
	if (!firstCandidate) return "";
	return firstCandidate.split(" ")[0] || "";
};

const parseDomProducts = ($: any) => {
	const items: SearchProduct[] = [];
	const selectors = [
		".ui-search-layout .ui-search-layout__item",
		"li.ui-search-layout__item",
		".ui-search-result__wrapper",
	];
	const selected = selectors.find((selector) => $(selector).length > 0);
	if (!selected) return items;

	$(selected).each((_: any, element: any) => {
		const product = $(element);

		const titleAnchor =
			product.find("h3.poly-component__title-wrapper a.poly-component__title").first()
				|| product.find("a.poly-component__title").first()
				|| product.find("a.ui-search-link").first();

		const title =
			titleAnchor.text().trim()
			|| product.find(".ui-search-item__title").first().text().trim()
			|| "";
		const url = normalizeUrl(
			String(
				titleAnchor.attr("href")
					|| product.find("a.ui-search-link").first().attr("href")
					|| product.find("a[href*='/MLA']").first().attr("href")
					|| product.find("a[href*='/ML']").first().attr("href")
					|| ""
			)
		);

		const currentAmount = product.find(".poly-price__current .andes-money-amount").first();
		const currentPrice =
			parsePriceNumber(currentAmount.attr("aria-label"))
			|| parsePriceNumber(currentAmount.find(".andes-money-amount__fraction").first().text())
			|| parsePriceNumber(product.find(".andes-money-amount__fraction").first().text());

		const previousAmount = product.find("s.andes-money-amount--previous").first();
		const originalPrice =
			parsePriceNumber(previousAmount.attr("aria-label"))
			|| parsePriceNumber(previousAmount.find(".andes-money-amount__fraction").first().text());

		const picture = product.find(".poly-component__picture").first();
		const image = toHttps(
			String(
				picture.attr("src")
					|| picture.attr("data-src")
					|| getImageFromSrcset(picture.attr("srcset"))
					|| product.find(".ui-search-result-image__element").first().attr("data-src")
					|| product.find(".ui-search-result-image__element").first().attr("src")
					|| getImageFromSrcset(product.find("img").first().attr("srcset"))
					|| product.find("img").first().attr("data-src")
					|| product.find("img").first().attr("src")
					|| ""
			)
		);

		const currency =
			product.find(".andes-money-amount__currency-symbol").first().text().trim() || "$";
		const freeShipping =
			product.find(".poly-component__shipping").first().text().trim()
			|| product.find(".ui-search-item__shipping").first().text().trim()
			|| "";
		const features =
			product
				.find(".ui-search-item__group__element.ui-search-item__variations-text")
				.text()
				.trim()
			|| product.find(".poly-buy-box__headline").first().text().trim()
			|| "";
		const isBestSeller =
			product
				.find(".ui-search-styled-label.ui-search-item__highlight-label__text")
				.text()
				.trim()
			|| product.find(".poly-component__ad-label").first().text().trim()
			|| "";

		if (!title || !url || currentPrice <= 0) return;

		const trustMeta = buildTrustMeta(url);

		items.push({
			url,
			title,
			currentPrice,
			originalPrice,
			image,
			freeShipping,
			currency,
			features,
			isBestSeller,
			source: "mercadolibre",
			domain: trustMeta.domain,
			trustScore: trustMeta.trustScore,
			trustLabel: trustMeta.trustLabel,
		});
	});

	return items;
};

const parseLdJsonProducts = ($: any) => {
	const items: SearchProduct[] = [];

	const pushItem = (value: any) => {
		if (!value || typeof value !== "object") return;

		const offer = Array.isArray(value.offers) ? value.offers[0] : value.offers;
		const currentPrice = parsePriceNumber(offer?.price ?? value.price);
		const rawUrl = String(value.url || offer?.url || "").trim();
		const url = normalizeUrl(rawUrl);
		const title = String(value.name || "").trim();
		const rawImage = Array.isArray(value.image) ? value.image[0] : value.image;
		const image = toHttps(String(rawImage || "").trim());

		if (!title || !url || currentPrice <= 0) return;

		const trustMeta = buildTrustMeta(url);

		items.push({
			url,
			title,
			currentPrice,
			originalPrice: 0,
			image,
			freeShipping: "",
			currency: offer?.priceCurrency === "ARS" ? "$" : String(offer?.priceCurrency || "$"),
			features: "",
			isBestSeller: "",
			source: "mercadolibre",
			domain: trustMeta.domain,
			trustScore: trustMeta.trustScore,
			trustLabel: trustMeta.trustLabel,
		});
	};

	const walk = (value: any) => {
		if (!value) return;

		if (Array.isArray(value)) {
			value.forEach((entry) => walk(entry));
			return;
		}

		if (typeof value !== "object") return;

		if (value["@type"] === "ItemList" && Array.isArray(value.itemListElement)) {
			value.itemListElement.forEach((entry: any) => walk(entry?.item || entry));
		}

		if (value["@type"] === "Product" || (value.name && value.offers)) {
			pushItem(value);
		}

		if (Array.isArray(value["@graph"])) {
			value["@graph"].forEach((entry: any) => walk(entry));
		}
	};

	$("script[type='application/ld+json']").each((_: any, element: any) => {
		const rawScript = $(element).contents().text().trim();
		if (!rawScript) return;

		try {
			const parsed = JSON.parse(rawScript);
			walk(parsed);
		} catch {
			// Ignore malformed JSON-LD blocks.
		}
	});

	return items;
};

const getBrightDataProxyConfig = () => {
	const username = String(process.env.BRIGHT_DATA_USERNAME || "").trim();
	const password = String(process.env.BRIGHT_DATA_PASSWORD || "").trim();
	if (!username || !password) return null;

	const sessionId = (1000000 * Math.random()) | 0;
	return {
		proxy: {
			protocol: "http" as const,
			host: "brd.superproxy.io",
			port: 22225,
			auth: {
				username: `${username}-session-${sessionId}`,
				password,
			},
		},
	};
};

const normalizeQueryText = (value: string) =>
	value
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

const buildSearchPathSlug = (value: string) =>
	value
		.trim()
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const looksBlocked = (html: string, pageTitle: string) => {
	const haystack = `${pageTitle}\n${html.slice(0, 5000)}`.toLowerCase();
	return /(captcha|recaptcha|verify you are human|enablejs|robot|tr[aá]fico inusual)/i.test(haystack);
};

const mergeSearchResults = (domProducts: SearchProduct[], ldProducts: SearchProduct[]) => {
	const ldByUrl = new Map(ldProducts.map((product) => [product.url, product]));

	const mergedFromDom = domProducts.map((product) => {
		const fromLd = ldByUrl.get(product.url);
		return {
			...product,
			image: product.image || fromLd?.image || "",
			currentPrice: product.currentPrice || fromLd?.currentPrice || 0,
			currency: product.currency || fromLd?.currency || "$",
		};
	});

	const domUrls = new Set(mergedFromDom.map((product) => product.url));
	const ldOnly = ldProducts.filter((product) => !domUrls.has(product.url));
	const all = [...mergedFromDom, ...ldOnly].filter(
		(product) => product.title && product.url && product.currentPrice > 0
	);

	const byUrl = new Map<string, SearchProduct>();
	for (const item of all) {
		if (!byUrl.has(item.url)) {
			byUrl.set(item.url, item);
			continue;
		}
		const existing = byUrl.get(item.url)!;
		byUrl.set(item.url, {
			...existing,
			image: existing.image || item.image,
			originalPrice: existing.originalPrice || item.originalPrice,
		});
	}

	return Array.from(byUrl.values());
};

export async function scrapeProductSearchPageML(productTitle: any) {
	const user = await getCurrentUser();
	const requestId = Math.random().toString(36).slice(2, 10);
	try {
		const defaultCountry: Country = "argentina";
		const country = (user?.country as Country) || defaultCountry;
		const baseUrl = SEARCH_BASE_BY_COUNTRY[country] || SEARCH_BASE_BY_COUNTRY.argentina;
		const rawQuery = decodeURIComponent(String(productTitle || "")).trim();
		if (!rawQuery) return [];

		const normalizedQuery = normalizeQueryText(rawQuery);
		const queryCandidates = Array.from(
			new Set([
				rawQuery,
				normalizedQuery,
				normalizedQuery.split(" ").slice(0, 8).join(" "),
				normalizedQuery.split(" ").slice(0, 6).join(" "),
			].filter(Boolean))
		);

		const proxyConfig = getBrightDataProxyConfig();
		const requestStrategies = [
			{
				name: "direct",
				config: { headers: REQUEST_HEADERS, timeout: 12000 },
			},
			...(proxyConfig
				? [
					{
						name: "proxy",
						config: {
							headers: REQUEST_HEADERS,
							timeout: 15000,
							...proxyConfig,
						},
					},
				]
				: []),
		];

		logInfo(requestId, "Starting MercadoLibre search scrape", {
			country,
			baseUrl,
			rawQuery,
			normalizedQuery,
			queryCandidates,
			strategies: requestStrategies.map((strategy) => strategy.name),
		});

		for (const candidate of queryCandidates) {
			const slug = buildSearchPathSlug(candidate);
			if (!slug) continue;
			const searchUrl = `${baseUrl}/${slug}`;

			for (const strategy of requestStrategies) {
				try {
					logInfo(requestId, "Trying search request", {
						candidate,
						strategy: strategy.name,
						searchUrl,
					});
					const response = await axios.get(searchUrl, strategy.config);
					const html = String(response.data || "");
					const $ = cheerio.load(html);

					const domProducts = parseDomProducts($);
					const ldProducts = parseLdJsonProducts($);
					const merged = mergeSearchResults(domProducts, ldProducts);
					const pageTitle = $("title").text().trim();
					const blocked = looksBlocked(html, pageTitle);

					logInfo(requestId, "Search response parsed", {
						status: response.status,
						candidate,
						strategy: strategy.name,
						totalDom: domProducts.length,
						totalLdJson: ldProducts.length,
						totalMerged: merged.length,
						pageTitle: pageTitle.slice(0, 120),
						blocked,
					});

					if (merged.length > 0) {
						return merged.sort((a, b) => a.currentPrice - b.currentPrice).slice(0, 60);
					}
				} catch (error: any) {
					logError(requestId, "Search request failed", {
						candidate,
						strategy: strategy.name,
						searchUrl,
						status: error?.response?.status,
						message: error?.message,
					});
				}
			}
		}

		logError(requestId, "No MercadoLibre products found for any candidate", {
			rawQuery,
			queryCandidates,
		});
		return [];
	} catch (error: any) {
		logError(requestId, "Unexpected MercadoLibre search scraper error", {
			message: error?.message,
		});
		return [];
	}
}
