import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Product } from "../types/types";
import * as productService from "../services/Product.service";

interface ProductContextType {
  products: Product[];
  setProducts: Dispatch<SetStateAction<Product[] | []>>;
  deleteProduct: (id: number) => void;
  addNewProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType>({ 
  products: [], 
  setProducts: () => {}, 
  deleteProduct: () => {},
  addNewProduct: () => {},
  updateProduct: () => {},
  isLoading: false 
});

interface Props {
  children: React.ReactNode; 
}

const ProductProvider = ({ children }: Props) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) return JSON.parse(storedProducts);
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const responseProducts = await productService.getAllProductsList();
        if (responseProducts) {
          setProducts(responseProducts);
          localStorage.setItem("products", JSON.stringify(responseProducts))
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [])

  const deleteProduct = (id: number) => {
    setProducts(prev => prev?.filter(product => product.id !== id));
  }

  const addNewProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  }

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(product => product.id !== updatedProduct.id ? product : updatedProduct))
  }

  return (
      <ProductContext.Provider value={{ products, setProducts, isLoading, deleteProduct, addNewProduct, updateProduct }}>
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