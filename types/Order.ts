import { Address } from "./Adress";
import { CartItem } from "./CartItem";

export interface Order {
    id: number;
    status: 'preparing' | 'send' | 'delivered';
    orderDate: string;
    userId: string;
    shippingAddress: Address;
    shippingPrice: number;
    paymentType: 'money' | 'card';
    products: CartItem[];
    paymentChange?: number;
    cupom?: string;
    cupomDiscount?: number;
    subtotal: number;
    total: number;
}