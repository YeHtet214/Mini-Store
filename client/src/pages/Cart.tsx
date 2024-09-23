import { useCart } from "../context/CartContextProvider";
import CartItem from "../components/CartItem";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemType } from "../types/types";

const Cart = () => {
      const { cartItems, setCheckOutItems } = useCart();
      const navigate = useNavigate();

      const [selectedList, setSelectedList] = useState<CartItemType[] | []>([]);
      // const [totalAmount, setTotalAmount] = useState<number>(0);

      useEffect(() => setCheckOutItems(selectedList), [selectedList]);
      
      const calculateOrderSummary = () => {
            const noOfItems = selectedList.reduce((accumulator, item) => accumulator + item.quantity, 0);
            const subTotal = selectedList.reduce((accumulator, item) => {
                  return (item.price * item.quantity) + accumulator;
            }, 0);

            // setTotalAmount(deliveryCharges + subTotal);
            return { subTotal, noOfItems };
      }

      const orderSummary = useMemo(calculateOrderSummary, [selectedList]);

      const handleCheckOut = async () => {
            if (!selectedList.length) {
                  alert("Please select item to proceed!")
                  return;
            } 
            navigate("/cart/checkout")
      }

      return (
            <div className="flex space-x-4">
                  <div>
                        {cartItems?.length ? cartItems.map(item => (
                              <CartItem key={item?.id} item={item} itemList={selectedList} setItemList={(items) => setSelectedList(items)} />
                        )) : (
                              <div>There is no item in the cart. Continue Shopping!</div>
                        )}
                  </div>
                  <div className="flex flex-col justify-between shadow-sm rounded w-2/5 h-60">
                        <p>
                              <span>Subtotal({ orderSummary.noOfItems } items)</span>
                              <span className="float-end">$ { (orderSummary.subTotal).toFixed(2) }</span>
                        </p>
                        <button className="border-2 border-violet-500 px-2" onClick={handleCheckOut}>Checkout</button>
                  </div>
            </div>
      )
}

export default Cart;