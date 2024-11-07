import axios from "axios";
import { Product } from "../types/types";

// const BASE_URL = "https://mini-store-server-production.up.railway.app";
const BASE_URL = "https://mini-store-api-theta.vercel.app/";

export const getAllProductsList = async () => {
      const url = `${BASE_URL}/products`;

      try {
            const response = await axios.get(url);
            if (!response.data) {
                  console.log("Something went wrong while fetching products!");
            }
            return response.data as Product[];
      } catch (error) {
            console.log(error);
      }
}

export const uploadNewProduct = async (data: Product) => {
      const url = `${BASE_URL}/products/manage/add`;

      console.log("Upload Prodduct: ", data)
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
      const url = `${BASE_URL}/products/manage/${id}/delete`;
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
      const url = `${BASE_URL}/products/manage/${updatedProduct.id}/update`;
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