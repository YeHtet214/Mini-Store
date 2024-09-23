import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Product } from "../types/types";
import * as productService from "../services/Product.service";

interface ProductContextType {
  products: Product[] | undefined;
  setProducts: Dispatch<SetStateAction<Product[] | undefined>>;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType>({ 
  products: [], 
  setProducts: () => {}, 
  isLoading: false 
});

interface Props {
  children: React.ReactNode; 
}

const ProductProvider = ({ children }: Props) => {
  const [products, setProducts] = useState<Product[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const responseProducts = await productService.getAllProductsList();
        setProducts(responseProducts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [])

  useEffect(() => {
    console.log(products)
  }, [products])

  return (
      <ProductContext.Provider value={{ products, setProducts, isLoading  }}>
        {children}
      </ProductContext.Provider>
  )
};

const useProduct = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within a product provider");
  }
  
  return context;
}

export { ProductContext, ProductProvider, useProduct };