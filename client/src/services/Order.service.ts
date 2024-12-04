import axios from "axios";
import { getUserId } from "../helper/helper";
import { CartItemType } from "../types/types";

const BASE_URL = "https://ministore-server.vercel.app/api";

export const getAllOrders  = async () => {
      const url = `${BASE_URL}/orders`;

      try {
            const response = await axios.get(url);
            return response.data;
      } catch (error) {
            console.log(error);
      }
}

export const getOrdersByUserId = async () => {
      const userId = getUserId();
      const url = `${BASE_URL}/orders`;

      try {
            const response = await axios.get(url, {
                  params: {
                        userId: userId
                  }
            });
            console.log("response data: ", response.data);
            return response.data;
      } catch (error) {
            console.log(error);
      }
}

export const getAllOrderItems  = async () => {
      const url = `${BASE_URL}/orderItems`;
      try {
            const response = await axios.get(url);
            return response.data;
      } catch (error) {
            console.log(error);
      }
}

export const createOrderSummary = async (totalAmount: number) => {
      const userId = getUserId();

      console.log("Total amount: ", totalAmount)
      try {
            const { data } = await axios.post(`${BASE_URL}/orders?userId=${userId}&totalAmount=${totalAmount}`);
            console.log("Order Summary", data);
            return data;
      } catch (error) {
            console.log(error);
      }
}

export const addOrderItems = async (orderId: number, items: CartItemType[]) => {
     console.log(orderId, typeof orderId);
      const url = `${BASE_URL}/orderItems?orderId=${orderId}`;
      console.log("ITEMS: ", items)
      try {
            const { data } = await axios.post(url, items);
            console.log("returned items", data)
            return data;
      } catch (error) {
            console.log(error);
      }
}

export const updateOrderState = async (orderId: number, value: string) => {
      const url = `${BASE_URL}/orders?orderId=${orderId}`;
      try {
            const res = await axios.put(url, { value });
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const deleteOrder = async (orderId: number) => {
      const url = `${BASE_URL}/orders?orderId=${orderId}`;
      try {
            const res = await axios.delete(url);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const getMonthlyOrderTotal = async () => {
      try {
            const res = await axios.get(`${BASE_URL}/orders`, {
                  params: {
                        filter: 'month',
                        userId: getUserId()
                  }
            })
            return res.data;
      } catch (error) {
            console.log(error);
      }
}