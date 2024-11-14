import axios from "axios";
import { getUserId } from "../helper/helper";
import { CartItemType } from "../types/types";

const BASE_URL = "https://ministore-server.vercel.app/api";

export const getAllOrders  = async () => {
      const url = `${BASE_URL}/manageOrders`;
      try {
            const response = await axios.get(url);
            console.log("respnose data: ", response.data);
            return response.data;
      } catch (error) {
            console.log(error);
      }
}

export const getAllOrderItems  = async () => {
      const url = `${BASE_URL}/manageOrderItems`;
      try {
            const response = await axios.get(url);
            return response.data;
      } catch (error) {
            console.log(error);
      }
}

export const createOrderSummary = async (totalAmount: number) => {
      const userId = getUserId();
      const url = `${BASE_URL}/manageOrders`;

      try {
            const { data } = await axios.post(url, {userId, totalAmount});
            return data;
      } catch (error) {
            console.log(error);
      }
}

export const addOrderItems = async (orderId: number, items: CartItemType[]) => {
      const url = `${BASE_URL}/orders/${orderId}/add`;
      try {
            const { data } = await axios.post(url, items);
            return data;
      } catch (error) {
            console.log(error);
      }
}

export const updateOrderState = async (orderId: number, value: string) => {
      const url = `${BASE_URL}/orders/${orderId}/update`;
      try {
            const res = await axios.put(url, { value });
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

export const deleteOrder = async (orderId: number) => {
      const url = `${BASE_URL}/orders/${orderId}/delete`;
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
                        filter: 'month'
                  }
            })
            return res.data;
      } catch (error) {
            console.log(error);
      }
}