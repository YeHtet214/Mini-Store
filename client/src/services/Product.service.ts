import axios from "axios";
import { Product } from "../types/types";

export const getAllProductsList = async () => {
      const url = 'http://localhost:5000/products';

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

export const uploadNewProduct = async (data: FormData) => {
      const url = 'http://localhost:5000/products/manage/add';

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
      const url = `http://localhost:5000/products/manage/${id}/delete`;
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
      const url = `http://localhost:5000/products/manage/${updatedProduct.id}/update`;
      try {
           const response = await axios.put(url, updatedProduct);  
           return response.data;
      } catch (error) {
            console.log(error);
            return {msg: "Updating Product Error: ", error};
      }

}