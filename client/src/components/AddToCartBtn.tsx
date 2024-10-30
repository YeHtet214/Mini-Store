import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { MouseEvent } from "react";
import * as CartServices from "../services/Cart.service";
import { useCart } from "../context/CartContextProvider";
import { getUserId } from "../helper/helper";

interface Props {
      productId: number;
}

const AddToCartBtn = ({ productId }: Props) => {
      const { cartItems } = useCart();
      // const [cartItem, setCartItem] = useState();
      const { setCartItems } = useCart();

      const handleCartUpdate = async (e: MouseEvent<HTMLSpanElement>) => {
            e.preventDefault();
            e.stopPropagation();
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
      }

      return (
            <span onClick={handleCartUpdate} className="text-right border-2 border-purple-800 text-purple-800 px-2 py-1 rounded cursor-pointer hover:bg-purple-800 hover:text-white transition-all ease-out hover:scale-95">
                  Add to Cart
                  <ShoppingCartIcon className="w-7 inline ml-4"/>
            </span>
      )     
}

export default AddToCartBtn;