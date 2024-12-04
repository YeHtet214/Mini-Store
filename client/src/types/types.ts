export interface Product {
      id: number;
      name: string;
      price: number;
      description: string;
      image: string | File;
      stock: number;
      category: string;
      rating: number;   
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
      order_status: 'Pending' | 'Processing' | 'Cancelled' | 'Delivered';
      address: string;
      name?: string;
      total_amount: number;
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
      user_id?: number | undefined;
      name?: string;
      email?: string;
      role?: string;
      password?: string;
      token?: string | null;
}

export type authType = 'login' | 'register';

export interface userInfo {
      name?: string;
      email: string;
      password: string;
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