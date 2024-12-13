import axios from "axios";
import { getUserId } from "../helper/helper";

const BASE_URL = "https://ministore-server.vercel.app/api";

export const getCartItemsByUserId = async () => {
      console.log("Get Cart Items SErvice: ")
      const user_id = getUserId();
      const url = `${BASE_URL}/cartItems?user_id=${user_id}`;
      try {
            const response = await axios.get(url);
            return response.data;
      } catch (err) {
            console.log(err);
      }
}

interface reqDataType {
      baseURL: string;
      cartItemId?: number;
      productId: number;
      userId: number;
      quantity: number;
}

export const updateCart = async (actionType: string,productId: number, cartItemId: number | undefined = undefined, quantity: number = 1) => {
      const reqData = {
            baseURL: `${BASE_URL}/cartItems`,
            cartItemId,
            productId,
            userId: getUserId(),
            quantity
      }
      let res;
      switch (actionType) {
            case "createNewCartItem":
                  res = createNewCartItem(reqData);
                  break;
            case "updateCartItemQty":
                  res = updateCartItemQty(reqData);
                  break;
            case "deleteCartItem":
                  res =deleteCartItem(reqData);
                  break;
      }
      return res;
}

async function createNewCartItem(data: reqDataType) {
      try {
            console.log(data);
            const res = await axios.post(data.baseURL, data);
            return res.data;
      } catch (error) {
            console.log(error);
      }
}

async function updateCartItemQty(reqData: reqDataType) {
      try {
            const res = await axios.put(reqData.baseURL, {data: reqData});
            return res.data;
      } catch (error) {
            console.log(error);
      }
} 

async function deleteCartItem(reqData: reqDataType) {
      const query = {
            id: reqData.cartItemId,
            userId: reqData.userId
      }
      try {
            const res = await axios.delete(reqData.baseURL, {data: query});
            return res.data;
      } catch (error) {
            console.log(error);
      }
}
