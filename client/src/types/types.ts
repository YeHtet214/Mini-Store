export interface Product {
      id: number;
      name: string;
      price: number;
      description: string;
      image: string;
      stock: number;
      category: string;
      rating: object;   
}

export interface CartItemType {
      id: number;
      product_id: number;
      cart_id: number;
      quantity: number;
      name: string;
      price: number;
      description: string;
      image: string;
      category: string;
}

export interface Order {
      order_id: number;
      order_date: Date;
      user_id: number;
      payment_method: string;
      status: string;
      address: string;
      total_amount: number;
}

export interface AdminOrder {
      order_id: number;
      name: string;
      user_id: string;
      order_date: Date;
      total_amount: number;
      status: string;
}

export interface OrderItemType {
    order_item_id: number;
    order_id: number;
    name: string;
    price: number;
    quantity: number;
    sub_total: number;
}

export interface User {
      user_id: number | undefined;
      name?: string;
      email?: string;
      password?: string;
      token?: string | null;
}

export type authType = 'login' | 'register';

export interface userInfo {
      name?: string;
      email: string;
      enterPassword: string;
}

export interface authData {
      token?: string;
      user_id?: string;
}

export interface AuthResponse {
      token?: string;
      user_id?: string;
      message?: string; 
      cartId?: number;
}