import axios from "axios";
import { getUserId } from "../helper/helper";
import { CartItemType } from "../types/types";

export const getAllOrders  = async () => {
      const url = 'http://localhost:5000/orders';
      try {
            const response = await axios.get(url);
            return response.data;
      } catch (error) {
            console.log(error);
      }
}

export const getAllOrderItems  = async () => {
      const url = 'http://localhost:5000/orders/items';
      try {
            const response = await axios.get(url);
            return response.data;
      } catch (error) {
            console.log(error);
      }
}

export const createOrderSummary = async (totalAmount: number) => {
      const userId = getUserId();
      const url = "http://localhost:5000/orders";

      try {
            const { data } = await axios.post(url, {userId, totalAmount});
            return data;
      } catch (error) {
            console.log(error);
      }
}

export const addOrderItems = async (orderId: number, items: CartItemType[]) => {
      const url = `http://localhost:5000/orders/${orderId}/add`;
      try {
            const res = await axios.post(url, items);
            console.log(res.data);
      } catch (error) {
            console.log(error);
      }
}

export const updateOrderState = async (orderId: number, value: string) => {
      const url = `http://localhost:5000/orders/${orderId}/update`;
      try {
            const res = await axios.put(url, { value });
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const deleteOrder = async (orderId: number) => {
      const url = `http://localhost:5000/orders/${orderId}/delete`;
      try {
            const res = await axios.delete(url);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}
