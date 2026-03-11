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

export async function scrapeProductSearchPageML(productTitle: any) {
	const user = await getCurrentUser();
	try {
		const defaultCountry: Country = "argentina";
		const country = (user?.country as Country) || defaultCountry;
		const baseUrl = SEARCH_BASE_BY_COUNTRY[country] || SEARCH_BASE_BY_COUNTRY.argentina;
		const query = decodeURIComponent(String(productTitle || "")).trim();
		const searchUrl = `${baseUrl}/${query}`;

		const response = await axios.get(searchUrl, {
			headers: REQUEST_HEADERS,
			timeout: 12000,
		});
		const html = response.data;
		const $ = cheerio.load(html);

		const domProducts = parseDomProducts($);
		const ldProducts = parseLdJsonProducts($);

		const ldByUrl = new Map(ldProducts.map((product) => [product.url, product]));

		// Complete missing images (and fallback values) with JSON-LD payload.
		const mergedFromDom = domProducts.map((product) => {
			const fromLd = ldByUrl.get(product.url);
			return {
				...product,
				image: product.image || fromLd?.image || "",
				currentPrice: product.currentPrice || fromLd?.currentPrice || 0,
				currency: product.currency || fromLd?.currency || "$",
			};
		});

		// Add products that only exist in JSON-LD and were not parsed from DOM.
		const domUrls = new Set(mergedFromDom.map((product) => product.url));
		const ldOnly = ldProducts.filter((product) => !domUrls.has(product.url));

		return [...mergedFromDom, ...ldOnly].filter(
			(product) => product.title && product.url && product.currentPrice > 0
		);
	} catch (error: any) {
		throw new Error(`Failed to scrape ML search product: ${error.message}`);
	}
}
