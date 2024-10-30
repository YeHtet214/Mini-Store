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
      const { isLoggedIn, currentUser } = useUser();
      const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
            const saveCartItems = localStorage.getItem('cartItems');
            return saveCartItems ? JSON.parse(saveCartItems) : []
      });
      const [cartId, setCartId] = useState<number | undefined>();
      const [totalQtyInCart, setTotalQtyInCart] = useState<number>(0);
      const [checkOutItems, setCheckOutItems] = useState<CartItemType[]>([]);

      useEffect(() => {
            (async () => {
                  if (!currentUser?.user_id) return;
                  if (isLoggedIn) {
                        const userCartItems = await CartServices.getCartItemsByUserId();
                        console.log("User Cart Items: ", userCartItems);
                        setCartItems(userCartItems);
                  }
            })();
      }, [isLoggedIn]);

      useEffect(() => {
            if (cartItems.length > 0) {
                  localStorage.setItem('cartItems', JSON.stringify(cartItems));
            } else {
                  localStorage.removeItem('cartItems');
            }
      }, [cartItems])

      useEffect(() => {
            if (cartItems?.length === 0 || !isLoggedIn) {
                  setTotalQtyInCart(0);
                  return;
            }
            // get the total number cart items from the user cart
            const itemQty = cartItems?.reduce((accumulator, item) => accumulator + item.quantity, 0);
            setTotalQtyInCart(itemQty);
      }, [cartItems, isLoggedIn]);

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