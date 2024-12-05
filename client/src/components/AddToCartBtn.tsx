import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import {MouseEvent, useState} from "react";
import * as CartServices from "../services/Cart.service";
import { useCart } from "../context/CartContextProvider";
import { getUserId } from "../helper/helper";
import LoadingDots from "./LoadingDots.tsx";

interface Props {
      productId: number;
}

const AddToCartBtn = ({ productId }: Props) => {
      const { cartItems } = useCart();
      const { setCartItems } = useCart();
      const [ isLoading, setIsLoading ] = useState<boolean>(false);

      const handleCartUpdate = async (e: MouseEvent<HTMLSpanElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLoading(true);
            if (!getUserId()) return;
            // Check if the product is already in the cart or not, 
            //    if exist, just add the qty 1 by default or create a new cart item
            const existingCartItem = cartItems?.find(item => item.product_id == productId);
            if (existingCartItem) {
                  const updateQty = existingCartItem.quantity + 1;
                  const updateCartItems = await CartServices.updateCart("updateCartItemQty", productId, existingCartItem.id, updateQty);
                  setCartItems(updateCartItems);
            } else {
                  const updateCartItems = await CartServices.updateCart("createNewCartItem", productId);
                  setCartItems(updateCartItems);
            }
            setIsLoading(false);
      }

      if (isLoading) return <LoadingDots />;

      return (

          <button
              onClick={handleCartUpdate}
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center">
                <ShoppingCartIcon className="h-5 w-5 mr-2"/>
                <span>Add</span>
          </button>
)
}

export default AddToCartBtn;