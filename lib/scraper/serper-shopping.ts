import axios from 'axios';

type SerperShoppingRequest = {
  q: string;
  gl: string;
  hl: string;
  num?: number;
};

export type SerperShoppingItem = {
  title?: string;
  link?: string;
  url?: string;
  source?: string;
  merchant?: string;
  store?: string;
  price?: string | number;
  extracted_price?: number;
  extractedPrice?: number;
  priceValue?: number;
  imageUrl?: string;
  image_url?: string;
  thumbnail?: string | { url?: string; link?: string };
  thumbnailUrl?: string;
  thumbnail_url?: string;
  thumbnails?: Array<string | { url?: string; link?: string }>;
  images?: Array<string | { url?: string; link?: string }>;
  image?: string | { url?: string; link?: string };
  productId?: string | number;
  rating?: number;
  ratingCount?: number;
  delivery?: string;
  returnPolicy?: string;
  snippet?: string;
};

export type SerperShoppingResponse = {
  shopping?: SerperShoppingItem[];
  results?: SerperShoppingItem[];
  [key: string]: unknown;
};

const SERPER_ENDPOINT = 'https://google.serper.dev/shopping';

export class SerperConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SerperConfigError';
  }
}

export async function fetchSerperShoppingRaw(
  params: SerperShoppingRequest,
  options?: { timeoutMs?: number },
): Promise<SerperShoppingResponse> {
  const apiKey = String(process.env.SERPER_API_KEY || '').trim();
  if (!apiKey) {
    throw new SerperConfigError('Missing SERPER_API_KEY');
  }

  const timeout = Math.max(2000, Math.min(20000, options?.timeoutMs ?? 12000));
  const response = await axios.get(SERPER_ENDPOINT, {
    timeout,
    params: {
      q: params.q,
      gl: params.gl,
      hl: params.hl,
      num: params.num,
      apiKey,
    },
    headers: {
      'X-API-KEY': apiKey,
    },
    maxBodyLength: 1024 * 1024,
    validateStatus: (status) => status >= 200 && status < 500,
  });

  if (response.status >= 400) {
    const message = `Serper request failed: ${response.status}`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).data = response.data;
    throw error;
  }

  return (response.data || {}) as SerperShoppingResponse;
}
