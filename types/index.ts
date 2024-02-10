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

export type NotificationType =
  | "WELCOME"
  | "CHANGE_OF_STOCK"
  | "LOWEST_PRICE"
  | "THRESHOLD_MET";

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
  ADMIN = "ADMIN",
  USER = "USER",
  SELLER = "SELLER",
}

export type SellerProfile = {
  id: number;
  first_name: string;
  last_name: string;
  nickname: string;
  registration_date: string;
  gender: string;
  country_id: string;
  email: string;
  identification: {
    type: string;
    number: string;
  };
  address: {
    state: string;
    city: string;
    address: string;
    zip_code: string;
  };
  phone: {
    area_code: string;
    number: string;
    extension: string;
    verified: boolean;
  };
  alternative_phone: {
    area_code: string;
    number: string;
    extension: string;
  };
  user_type: string;
  tags: string[];
  logo: string | null;
  points: number;
  site_id: string;
  permalink: string;
  seller_experience: string;
  seller_reputation: {
    level_id: string | null;
    power_seller_status: string | null;
    transactions: {
      period: string;
      total: number;
      completed: number;
      canceled: number;
      ratings: {
        positive: number;
        negative: number;
        neutral: number;
      };
    };
  };
  buyer_reputation: {
    canceled_transactions: number;
    transactions: {
      period: string;
      total: number | null;
      completed: number | null;
      canceled: {
        total: number | null;
        paid: number | null;
      };
      unrated: {
        total: number | null;
        paid: number | null;
      };
      not_yet_rated: {
        total: number | null;
        paid: number | null;
        units: number | null;
      };
    };
    tags: string[];
  };
  status: {
    site_status: string;
    list: {
      allow: boolean;
      codes: string[];
      immediate_payment: {
        required: boolean;
        reasons: string[];
      };
    };
    buy: {
      allow: boolean;
      codes: string[];
      immediate_payment: {
        required: boolean;
        reasons: string[];
      };
    };
    sell: {
      allow: boolean;
      codes: string[];
      immediate_payment: {
        required: boolean;
        reasons: string[];
      };
    };
    billing: {
      allow: boolean;
      codes: string[];
    };
    mercadopago_tc_accepted: boolean;
    mercadoenvios: string;
    immediate_payment: boolean;
    confirmed_email: boolean;
    user_type: string;
    required_action: string;
  };
  credit: {
    consumed: number;
    credit_level_id: string;
  };
};
