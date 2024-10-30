// import CartItem from "../components/CartItem";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContextProvider"
import * as OrderServices from "../services/Order.service";
import { Order } from "../types/types";
import { UseOrders } from "../context/OrderContextProvider";

const CheckOut = () => {
      const { checkOutItems } = useCart();
      const { addNewOrder } = UseOrders();
      const [totalAmount, setTotalAmount] = useState<number>(0);
      const [order, setOrder] = useState<Order>();
      // const deliveryCharges = Math.floor((Math.random() * 20) + 5); // just the demostration for the functionality
      const deliveryCharges = 20;

      useEffect(() => {
            calcTotalCost();
      }, []);

      useEffect(() => {
            console.log("Total Cost: ", totalAmount);
      }, [totalAmount])

      const calcTotalCost = () => {
            console.log(checkOutItems);
            const subTotal = checkOutItems.reduce((accumulator, item) => {
                  return (item.price * item.quantity) + accumulator;
            }, 0);

            setTotalAmount(deliveryCharges + subTotal);
      }

      const handleProceedOrder = async () => {
            if (!checkOutItems.length) return;
            const newOrder = await OrderServices.createOrderSummary(totalAmount) as Order;

            if (newOrder) {
                  setOrder(newOrder);
                  addNewOrder(newOrder);
                  await OrderServices.addOrderItems(newOrder.order_id, checkOutItems);
            }
      }
      
      const handlePayment = (status: boolean) => {
            if (status && order) {
                  // success the order
                  OrderServices.updateOrderState(order.order_id, "completed");
            } else {
                  console.log("Order failed due to payment error")
            }
      }

      return (
            <div>
                  <h1>Checkout Items</h1>
                  {checkOutItems?.map(item => (
                        // <CartItem key={item.id} item={item} />
                        <div key={item.id}>
                              <h3>{item.name}</h3>
                              <img src={item.image} alt="product_image" className="w-20" />
                        </div>
                  ))}
                  <button className="border-2 border-purple-700" onClick={handleProceedOrder}>Proceed Order</button>
                  {
                        order && (
                              <div>
                                    <h1>{order.total_amount}</h1>
                                    <p>
                                          Are you sure you want to make a payment for this?
                                          <span onClick={() => handlePayment(false)}>No</span> <span onClick={() => handlePayment(true)}>Yes</span>
                                    </p>

                              </div>
                        )
                  }
            </div>
      )
}

export default CheckOut;