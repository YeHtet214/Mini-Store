import { CreditCard, Truck, ChevronLeft, CheckCircle, AlertCircle, CircleCheckBig } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useCart } from "../context/CartContextProvider"
import * as OrderServices from "../services/Order.service";
import { Order, OrderItemType } from "../types/types";
import { UseOrders } from "../context/OrderContextProvider";
import { currency } from '../helper/helper';
import axios from 'axios';
import { useUser } from '../context/UserContextProvider';
import {useNavigate} from 'react-router-dom';
// import {loadStripe} from "@stripe/stripe-js";

const BASE_URL = "https://ministore-server.vercel.app/api";

const SuccessRedirectModel = () => {
      const navigate = useNavigate();
      useEffect(() => {
            setTimeout(() => navigate("/"), 3000);
      }, []);

     return (
       <div className="w-1/2 mx-auto mt-1/2">
             <h1>Order Successful! Thank You <CircleCheckBig color="#098500" /></h1>
       </div>
     )
}

const CheckOut = () => {
      const { checkOutItems } = useCart();
      const { addNewOrder, addNewOrderItems } = UseOrders();
      const { currentUser } = useUser();
      const navigate = useNavigate();
      const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'paypal'>('card')
      const [isProcessing, setIsProcessing] = useState(false)
      const [success, setSuccess] = useState(false);
      const [orderSummary, setOrderSummary] = useState({ subTotal: 0, totalAmount: 0 });
      const [address, setAddress] = useState({ address: "", city: "", state: "", postcode: "", country: "" });
      const [error, setError] = useState(false);

      useEffect(() => {
            if (checkOutItems.length == 0) {
                  navigate("/cart");
            }
            calcTotalCost();
      }, []);

      const calcTotalCost = () => {
            const subTotal = checkOutItems.reduce((accumulator, item) => {
                  return (item.price * item.quantity) + accumulator;
            }, 0);

            setOrderSummary({ subTotal, totalAmount: 10 + subTotal });
      }

      const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setAddress(prev => ({ ...prev, [name]: value }));
      }

      const handleProceedOrder = async () => {
            if (!checkOutItems.length) return;
            console.log(checkOutItems)
            const newOrder = await OrderServices.createOrderSummary(orderSummary.totalAmount) as Order;
            console.log("New Order: ", newOrder);
            if (newOrder.order_id) {
                  addNewOrder(newOrder);
                  const newOrderItems = await OrderServices.addOrderItems(newOrder.order_id, checkOutItems) as OrderItemType[];
                  newOrderItems.forEach(orderItem =>  addNewOrderItems(orderItem));

                  // await handleCheckOutSession();
            } else {
                  alert("Something went wrong, please select the product again!")
            }
      }

      // const handleCheckOutSession = async () => {
      //       const stripe = await loadStripe("pk_live_51KUBqGEWeizE607MnNqxaCZYCD11Qd1xVpYH2B7tuTP5lxS0aBHPlZS2e2FkQGtod2fbgaHoqd8FL1SFQvUOcrDx00FqfjK4S3");
      //       const body = {
      //             products: checkOutItems
      //       }
      //       const headers = {
      //             "Content-Type": "application/json"
      //       }
      //       const response = await axios.post("/create-checkout-session", {
      //             headers,
      //             body: JSON.stringify(body)
      //       })
      //
      //       const session = response.data;
      //
      //       const result = stripe?.redirectToCheckout({
      //             sessionId: session.id
      //       });
      //
      //       console.log(result);
      // }

      const handleSubmit = async () => {
            // check if address form is properly filled
            if ( !address.city || !address.address || !address.country || !address.postcode || !address.state ) {
                  return setError(true);
            }
            setIsProcessing(true);
            try {
                  // Serialize the address object into query parameters
                  const addressQuery = new URLSearchParams({
                        city: address.city,
                        country: address.country,
                        postcode: address.postcode,
                        state: address.state,
                        address: address.address
                  }).toString();

                  console.log(addressQuery)
                  const { data } = await axios.post(
                    `${BASE_URL}/orders?${addressQuery}&userId=${currentUser?.user_id}`
                  );

                  console.log("Address data returned?: ", data);
                  await handleProceedOrder();
            } catch (error) {
                  console.error("Error submitting order:", error);
                  setError(true);
            } finally {
                  setIsProcessing(false);
                  setSuccess(true);
            }
      }

      if (success) return <SuccessRedirectModel />;

      return (
            <div className="min-h-screen bg-gray-100 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center mb-8">
                              <a href="/cart" className="flex items-center text-indigo-600 hover:text-indigo-700">
                                    <ChevronLeft className="h-5 w-5 mr-1" />
                                    Back to Cart
                              </a>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                              {/* Checkout Form */}
                              <div className="lg:w-2/3">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                          {/* Shipping Information */}
                                          <div className="bg-white rounded-lg shadow p-6">
                                                <div className="flex items-center mb-6">
                                                      <Truck className="h-6 w-6 text-indigo-600 mr-2" />
                                                      <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                      <div>
                                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                                                  Address Line
                                                            </label>
                                                            <input
                                                                  type="text"
                                                                  id="addressline"
                                                                  required
                                                                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                                                                  name="address"
                                                                  value={address.address}
                                                                  onChange={handleAddressChange}
                                                            />
                                                      </div>
                                                      <div>
                                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                                  City
                                                            </label>
                                                            <input
                                                                  type="text"
                                                                  id="city"
                                                                  required
                                                                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                  name="city"
                                                                  value={address.city}
                                                                  onChange={handleAddressChange}
                                                            />
                                                      </div>
                                                      <div>
                                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                                                  State
                                                            </label>
                                                            <input
                                                                  type="text"
                                                                  id="state"
                                                                  required
                                                                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                  name="state"
                                                                  value={address.state}
                                                                  onChange={handleAddressChange}
                                                            />
                                                      </div>
                                                      <div>
                                                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                                                  Country
                                                            </label>
                                                            <input
                                                                  type="text"
                                                                  id="country"
                                                                  required
                                                                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                  name="country"
                                                                  value={address.country}
                                                                  onChange={handleAddressChange}
                                                            />
                                                      </div>
                                                      <div>
                                                            <label htmlFor="postCode" className="block text-sm font-medium text-gray-700">
                                                                  Post Code
                                                            </label>
                                                            <input
                                                                  type="text"
                                                                  id="postCode"
                                                                  required
                                                                  className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                  name="postcode"
                                                                  value={address.postcode}
                                                                  onChange={handleAddressChange}
                                                            />
                                                      </div>
                                                </div>

                                                { error && (
                                                    <div
                                                        className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                                        role="alert">
                                                          <span className="block sm:inline">Please fill the requried form</span>
                                                          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                                            <AlertCircle className="h-6 w-6 text-red-500"/>
                                                          </span>
                                                    </div>
                                                )}
                                          </div>

                                          {/* Payment Method */}
                                          <div className="bg-white rounded-lg shadow p-6">
                                                <div className="flex items-center mb-6">
                                                      <CreditCard className="h-6 w-6 text-indigo-600 mr-2"/>
                                                      <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                                                </div>
                                                <div className="space-y-4">
                                                      <div className="flex items-center">
                                                            <input
                                                                  type="radio"
                                                                  id="card"
                                                                  name="paymentMethod"
                                                                  checked={selectedPaymentMethod === 'card'}
                                                                  onChange={() => setSelectedPaymentMethod('card')}
                                                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                            />
                                                            <label htmlFor="card" className="ml-3 block text-sm font-medium text-gray-700">
                                                                  Credit Card
                                                            </label>
                                                      </div>
                                                      {selectedPaymentMethod === 'card' && (
                                                            <div className="ml-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                  <div className="md:col-span-2">
                                                                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                                                              Card Number
                                                                        </label>
                                                                        <input
                                                                              type="text"
                                                                              id="cardNumber"
                                                                              required
                                                                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        />-
                                                                  </div>
                                                                  <div>
                                                                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                                                              Expiry Date
                                                                        </label>
                                                                        <input
                                                                              type="text"
                                                                              id="expiryDate"
                                                                              placeholder="MM/YY"
                                                                              required
                                                                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        />
                                                                  </div>
                                                                  <div>
                                                                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                                                                              CVC
                                                                        </label>
                                                                        <input
                                                                              type="text"
                                                                              id="cvc"
                                                                              required
                                                                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                        />
                                                                  </div>
                                                            </div>
                                                      )}
                                                      <div className="flex items-center">
                                                            <input
                                                                  type="radio"
                                                                  id="paypal"
                                                                  name="paymentMethod"
                                                                  checked={selectedPaymentMethod === 'paypal'}
                                                                  onChange={() => setSelectedPaymentMethod('paypal')}
                                                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                            />
                                                            <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                                                                  PayPal
                                                            </label>
                                                      </div>
                                                </div>
                                          </div>
                                    </form>
                              </div>

                              {/* Order Summary */}
                              <div className="lg:w-1/3">
                                    <div className="bg-white rounded-lg shadow p-6">
                                          <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                                          <div className="flow-root">
                                                <ul className="-my-4 divide-y divide-gray-200">
                                                      {checkOutItems.map((item) => (
                                                            <li key={item.id} className="py-4 flex items-center">
                                                                  <img
                                                                        src={(item.image as string)?.includes('uploads') ? 'http://localhost:5000/' + item.image : item.image as string}
                                                                        alt={item.name}
                                                                        className="h-16 w-16 rounded-md object-cover"
                                                                  />
                                                                  <div className="ml-4 flex-1">
                                                                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                                                        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                                                              {currency.format(item.price * item.quantity)}
                                                                        </p>
                                                                  </div>
                                                            </li>
                                                      ))}
                                                </ul>
                                          </div>
                                          <dl className="mt-6 space-y-4">
                                                <div className="flex items-center justify-between">
                                                      <dt className="text-sm text-gray-600">Subtotal</dt>
                                                      <dd className="text-sm font-medium text-gray-900">{currency.format(orderSummary.subTotal)}</dd>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                      <dt className="text-sm text-gray-600">Shipping</dt>
                                                      <dd className="text-sm font-medium text-gray-900">$10.00</dd>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                                      <dt className="text-base font-medium text-gray-900">Order total</dt>
                                                      <dd className="text-base font-medium text-gray-900">{currency.format(orderSummary.totalAmount)}</dd>
                                                </div>
                                          </dl>
                                          <button
                                                type="submit"
                                                disabled={isProcessing}
                                                onClick={handleSubmit}
                                                className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center"
                                          >
                                                {isProcessing ? (
                                                      <>Processing...</>
                                                ) : (
                                                      <>
                                                            <CheckCircle className="h-5 w-5 mr-2" />
                                                            Complete Order
                                                      </>
                                                )}
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

export default CheckOut;