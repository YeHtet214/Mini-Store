import { useCart } from "../context/CartContextProvider";
import CartItem from "../components/CartItem";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemType } from "../types/types";
import { ShoppingBag } from 'lucide-react'
import { currency } from "../helper/helper";

const Cart = () => {
      const { cartItems, setCheckOutItems } = useCart();
      const navigate = useNavigate();
      const [selectedList, setSelectedList] = useState<CartItemType[] | []>([]);

      useEffect(() => setCheckOutItems(selectedList), [selectedList]);
      
      const calculateOrderSummary = () => {
            const noOfItems = selectedList.reduce((accumulator, item) => accumulator + item.quantity, 0);
            const subTotal = selectedList.reduce((accumulator, item) => {
                  return (item.price * item.quantity) + accumulator;
            }, 0);

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
            <div className="min-h-screen bg-gray-100 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({cartItems.length} items)</h1>
                              <span className="text-sm text-gray-500">
                                    {selectedList.length} items selected
                              </span>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                              {/* Cart Items List */}
                              <div className="lg:w-2/3">
                                    <div className="bg-white rounded-lg shadow">
                                          {cartItems.length === 0 ? (
                                                <div className="p-8 text-center">
                                                      <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                                                      <p className="mt-4 text-gray-500">Your cart is empty</p>
                                                </div>
                                          ) : (
                                          <ul className="divide-y divide-gray-200">
                                                {cartItems.map((item) => (
                                                      <li key={item.id} className="p-6">
                                                            <CartItem item={item} itemList={selectedList} setItemList={(items) => setSelectedList(items)} />
                                                      </li>
                                                ))}
                                          </ul>
                                          )}
                                    </div>
                              </div>

                  {/* Order Summary */}
                              <div className="lg:w-1/3">
                                    <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                                    <div className="flow-root">
                                    <dl className="-my-4 text-sm divide-y divide-gray-200">
                                          <div className="py-4 flex items-center justify-between">
                                                <dt className="text-gray-600">Selected items</dt>
                                                <dd className="font-medium text-gray-900">{orderSummary.noOfItems}</dd>
                                          </div>
                                          <div className="py-4 flex items-center justify-between">
                                                <dt className="text-gray-600">Subtotal</dt>
                                                <dd className="font-medium text-gray-900">{currency.format(orderSummary.subTotal)}</dd>
                                          </div>
                                          <div className="py-4 flex items-center justify-between">
                                                <dt className="text-gray-600">Shipping</dt>
                                                <dd className="font-medium text-gray-900">$10.00</dd>
                                          </div>
                                          <div className="py-4 flex items-center justify-between">
                                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                                <dd className="text-base font-medium text-gray-900">
                                                      {currency.format(orderSummary.subTotal + 10)}
                                                </dd>
                                          </div>
                                    </dl>
                                    </div>
                                          <button
                                                className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={handleCheckOut}
                                                disabled={selectedList.length == 0}
                                          >
                                                Proceed to Checkout
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default Cart;
