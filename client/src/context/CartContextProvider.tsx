import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
import { CartItemType } from "../types/types";
import { useUser } from "./UserContextProvider";
import * as CartServices from "../services/Cart.service";

// check if the user is authenticated?
// if the user is already authenticated, get the cart items from the cart associating user;

interface CartContextType {
      cartItems: CartItemType[] | [];
      setCartItems: Dispatch<SetStateAction<CartItemType[] | []>>;
      cartId: number | undefined;
      setCartId: Dispatch<SetStateAction<number | undefined>>;
      totalQtyInCart: number;
      setTotalQtyInCart: Dispatch<SetStateAction<number>>;
      checkOutItems: CartItemType[] | [];
      setCheckOutItems: Dispatch<SetStateAction<CartItemType[] | []>>;
}

const CartContext = createContext<CartContextType | null>(null);

const CartContextProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
      const { isLoggedIn, user } = useUser();
      const [cartItems, setCartItems] = useState<CartItemType[]>([]);
      const [cartId, setCartId] = useState<number | undefined>();
      const [totalQtyInCart, setTotalQtyInCart] = useState<number>(0);
      const [checkOutItems, setCheckOutItems] = useState<CartItemType[]>([]);

      useEffect(() => {
            handleCartItems();
      }, [isLoggedIn])

      useEffect(() => {
            updateTotalQtyInCart();
      }, [cartItems, isLoggedIn]);

      async function handleCartItems() {
            if (isLoggedIn) {
                  if (!user?.user_id) return;
                  const userCartItems = await CartServices.getCartItemsByUserId();
                  setCartItems(userCartItems);
            }
      }

      async function updateTotalQtyInCart() {
            if (cartItems?.length === 0 || !isLoggedIn) {
                  setTotalQtyInCart(0);
                  return;
            }
            // get the total number cart items from the user cart
            const itemQty = cartItems?.reduce((accumulator, item) => accumulator + item.quantity, 0);
            setTotalQtyInCart(itemQty);
      }

      return (
            <CartContext.Provider value={{ cartItems, setCartItems, cartId, setCartId, totalQtyInCart, setTotalQtyInCart, checkOutItems, setCheckOutItems }}>
                  {children}
            </CartContext.Provider>
      )
}

const useCart = () => {
      const context = useContext(CartContext);
      if (!context) {
            console.log("There is no context for cart item");
            throw new Error("Cart Context should be in the Cart provider!");
      }
      return context;
}

export { useCart, CartContextProvider };