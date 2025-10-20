export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
} 

export interface IBuyer {
    payment: 'card' | 'cash' | '';
    email: string;
    phone: string;
    address: string;
}

export interface IValidationErrors {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}

export interface IProductResponse {
  items: IProduct[];
}

export type IOrderResponse = {
  orderId: string;
};

export interface IApi {
  get<T>(path: string): Promise<T>;
  post<T, U>(path: string, payload: T): Promise<U>;
}

export interface ICartItem {
  productId: string
  quantity: number
}

export interface IOrderPayload {
  items: ICartItem[]
  totalPrice: number
  buyer: IBuyer
}
