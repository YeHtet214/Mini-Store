import axios from "axios";
import { Product } from "../types/types";

const BASE_URL = "https://ministore-server.vercel.app/api";

export const getAllProductsList = async () => {
      const url = `${BASE_URL}/manageProducts`;

      try {
            const response = await axios.get(url);
            if (!response.data) {
                  console.log("Something went wrong while fetching products!");
            }
            console.log(response.data, "product list");
            return response.data as Product[];
      } catch (error) {
            console.log(error);
      }
}

export const uploadNewProduct = async (data: Product) => {
      const url = `${BASE_URL}/manageProducts`;

      console.log("Upload Product: ", data)
      try {
            const response = await axios.post(url, data, {
                  headers: {
                        'Content-Type': 'multipart/form-data'
                  }
            })
            return response.data;
      } catch(err) {
            console.log(err);
            return {msg: "Uploading Product Error: ", err};
      }
}

export const deleteProduct = async (id: number) => {
      const url = `${BASE_URL}/manageProducts?id=${id}`;
      try {
            const response = await axios.delete(url)
            console.log(response.data);
            return response.data;
      } catch(err) {
            console.log(err);
            return {msg: "Deleting Product Error: ", err};
      }
}

export const updateProduct = async (updatedProduct: Product) => {
      console.log(updatedProduct);
      const url = `${BASE_URL}/manageProducts?id=${updatedProduct.id}`;
      try {
           const response = await axios.put(url, updatedProduct, {
                  headers: {
                        'Content-Type': 'multipart/form-data'
                  }
           });  
           return response.data;
      } catch (error) {
            console.log(error);
            return {msg: "Updating Product Error: ", error};
      }

}