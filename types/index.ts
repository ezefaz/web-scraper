export type PriceHistoryItem = {
  price: number;
  date: Date;
  _id: string;
};

export type CurrentDolar = {
  value: number;
  date: Date;
};

export type User = {
  email: string;
};

export type Product = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  currentDolar: CurrentDolar;
  currentDolarValue?: number;
  priceHistory: PriceHistoryItem[] | [];
  highestPrice: number;
  lowestPrice: number;
  averagePrice: number;
  discountRate: number;
  description: string;
  category: string;
  reviewsCount: number;
  stars: number;
  stockAvailable?: string;
  isOutOfStock: Boolean;
  users?: User[];
};

export type NotificationType = 'WELCOME' | 'CHANGE_OF_STOCK' | 'LOWEST_PRICE' | 'THRESHOLD_MET';

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
