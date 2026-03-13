const ML_BASE_URL = "https://www.mercadolibre.com.ar";

const cleanText = (value?: string | null) =>
  (value || "").replace(/\s+/g, " ").trim();

const normalizeSellerDisplayName = (value?: string | null) => {
  const normalized = cleanText(value)
    .replace(/^vendido\s*por\s*/i, "")
    .replace(/\|.*$/, "")
    .trim();

  if (!normalized) return "";

  // Fix cases where ML renders concatenated words (e.g. "MiTiendaOficial")
  const withSpaces = normalized
    .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
    .replace(/([A-ZÁÉÍÓÚÑ]{2,})([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/g, "$1 $2");

  return cleanText(withSpaces);
};

const parseSellerNameFromInfo = (sellerInfoRaw: string) => {
  const normalized = cleanText(sellerInfoRaw);
  if (!normalized) return "";

  const match = normalized.match(/Vendido por\s+(.+?)(?:\s+\||$)/i);
  return normalizeSellerDisplayName(match?.[1]);
};

const normalizeSellerUrl = (href?: string | null) => {
  const rawHref = cleanText(href);
  if (!rawHref) return "";
  if (rawHref.startsWith("http")) return rawHref;
  if (rawHref.startsWith("/")) return `${ML_BASE_URL}${rawHref}`;
  return rawHref;
};

const extractWarranty = ($: any) => {
  const candidates = [
    ".ui-pdp-warranty__term",
    ".ui-pdp-container__row--warranty .ui-pdp-media__title",
    ".ui-pdp-container__row--warranty .ui-pdp-media__subtitle",
    ".ui-pdp-warranty .ui-pdp-media__title",
  ];

  for (const selector of candidates) {
    const text = cleanText($(selector).first().text());
    if (text && /garant/i.test(text)) return text;
  }

  const genericWarranty = $(".ui-pdp-media__title")
    .toArray()
    .map((element: any) => cleanText($(element).text()))
    .find((text: string) => /garant/i.test(text));

  return genericWarranty || "";
};

export const extractMercadoLibreSeller = ($: any) => {
  const sellerSection = $(".ui-pdp-seller, .ui-pdp-seller__header").first();
  const sellerInfoText = cleanText($(".ui-pdp-seller__header__info-container").first().text());
  const sellerSectionText = cleanText(sellerSection.text());

  const sellerNameFromInfo = parseSellerNameFromInfo(sellerInfoText);
  const sellerNameFromTitle = cleanText(
    sellerSection
      .find(
        ".ui-pdp-seller__link-trigger, .ui-pdp-seller__header__title, .ui-pdp-seller__header__title-container",
      )
      .first()
      .text(),
  );

  const sellerName = normalizeSellerDisplayName(sellerNameFromTitle || sellerNameFromInfo);

  const sellerProfileUrl = normalizeSellerUrl(
    sellerSection
      .find("a.ui-pdp-seller__link-trigger, .ui-pdp-action-modal__link, a")
      .first()
      .attr("href"),
  );

  const sellerReputationFromNode = cleanText(
    sellerSection
      .find(
        ".ui-pdp-seller__status-title, .ui-pdp-seller__reputation-title, .ui-pdp-seller__header__subtitle",
      )
      .first()
      .text(),
  );
  const sellerReputationFromText = cleanText(
    sellerSectionText.match(
      /(MercadoL[ií]der(?:\s+\w+)?|Excelente|Muy buena|Buena|Regular|Reputaci[oó]n[^|.,]*)/i,
    )?.[0],
  );
  let sellerReputation = sellerReputationFromNode || sellerReputationFromText;

  const sellerSalesFromNode = cleanText(
    sellerSection
      .find(".ui-pdp-seller__status-subtitle, .ui-pdp-seller__sales-description")
      .first()
      .text(),
  );
  const sellerSalesFromText = cleanText(
    sellerSectionText.match(
      /(\+?\d[\d.,]*(?:\s*(?:mil|millones))?\s*(?:ventas?|vendidos?|ventas concretadas))/i,
    )?.[0],
  );
  let sellerSales = sellerSalesFromNode || sellerSalesFromText;

  if (sellerReputation.includes("|")) {
    const [reputationPart, salesPart] = sellerReputation.split("|");
    sellerReputation = cleanText(reputationPart).replace(/^reputaci[oó]n[:\s-]*/i, "");
    if (!sellerSales && salesPart) {
      sellerSales = cleanText(salesPart);
    }
  }

  sellerReputation = sellerReputation.replace(/^reputaci[oó]n[:\s-]*/i, "");

  const officialStoreText = cleanText(
    sellerSection
      .find(".ui-pdp-color--BLUE.ui-pdp-family--REGULAR, .ui-pdp-seller__official-store")
      .first()
      .text(),
  );
  const sellerIsOfficialStore = /tienda oficial/i.test(
    `${officialStoreText} ${sellerSectionText}`,
  );
  const sellerWarranty = extractWarranty($);

  return {
    sellerName: sellerName || "",
    sellerProfileUrl: sellerProfileUrl || "",
    sellerReputation: sellerReputation || "",
    sellerSales: sellerSales || "",
    sellerWarranty: sellerWarranty || "",
    sellerIsOfficialStore,
  };
};
