export type PriceHistoryItem = {
  price: number;
  date: Date;
  _id: string;
};

export type DolarHistoryItem = {
  value: number;
  date: Date;
  _id: string;
};

export interface MonthlyData {
  Month: string;
  Mayor: number | string;
  Menor: number | string;
}

export type CurrentDolar = {
  value: number | any;
  date: Date;
};

export type Country = {
  name: string;
  tag: string;
  currency: string;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string;
  country?: string;
  password?: string;
  products?: ProductType[];
  productsFavoritos?: ProductType[];
  subscription: string;
  isFollowing?: boolean;
  role?: string;
  isTwoFactorEnabled?: boolean;
  emailVerified: Date;
  suscription?: string;
};

export type ProductType = {
  _id?: string;
  url: string;
  currency: string;
  image: string;
  title: string;
  currentPrice: number;
  originalPrice: number;
  currentDolar: CurrentDolar;
  // currentDolarValue?: number;
  priceHistory: PriceHistoryItem[] | [];
  dolarHistory: DolarHistoryItem[] | [];
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
  users?: UserType[] | undefined;
  storeName?: String;
  isFreeReturning?: boolean;
  isFreeShipping?: boolean;
  status?: string;
  productReviews?: Array<string>;
  isFollowing?: boolean;
};

export type NotificationType = 'WELCOME' | 'CHANGE_OF_STOCK' | 'LOWEST_PRICE' | 'THRESHOLD_MET';

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  image: string;
  url: string;
};

export type TiendamiaProduct = {
  title: string;
  brand: string;
  description?: string;
  currentPrice: string;
  originalPrice: string;
  currentDollarPrice: string;
  originalDollarPrice: string;
  url: string;
  image: string;
  vendorsName?: string;
  returnMessage: string;
  availabilityMessage: string;
  refurbishedMessage: string;
};

export type GoogleAccount = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
  expires_at: number;
  provider: string;
  type: string;
  providerAccountId: string;
};

export const enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}
