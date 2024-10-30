import { useCart } from "../context/CartContextProvider";
import CartItem from "../components/CartItem";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItemType } from "../types/types";
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { currency } from "../helper/helper";

const Cart = () => {
      const { cartItems, setCheckOutItems } = useCart();
      const navigate = useNavigate();
      const [selectedList, setSelectedList] = useState<CartItemType[] | []>([]);

      useEffect(() => {
            console.log("Cart Items in CArt Page: ", cartItems);
      })


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
            // <div className="flex space-x-4">
            //       <div>
            //             {cartItems?.length > 0 ? cartItems.map(item => (
            //                   <CartItem key={item?.id} item={item} itemList={selectedList} setItemList={(items) => setSelectedList(items)} />
            //             )) : (
            //                   <div>There is no item in the cart. Continue Shopping!</div>
            //             )}
            //       </div>
            //       <div className="flex flex-col justify-between shadow-sm rounded w-2/5 h-60">
            //             <p>
            //                   <span>Subtotal({ orderSummary.noOfItems } items)</span>
            //                   <span className="float-end">$ { (orderSummary.subTotal).toFixed(2) }</span>
            //             </p>
            //             <button className="border-2 border-violet-500 px-2" onClick={handleCheckOut}>Checkout</button>
            //       </div>
            // </div>
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

// import React, { useState } from 'react'
// import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
// import { useCart } from '../context/CartContextProvider'

// interface CartItem {
//   id: number
//   name: string
//   price: number
//   quantity: number
//   image: string
//   selected: boolean
// }

// export default function CartPage() {
//       const { cartItems, setCheckOutItems } = useCart();

//       // const [cartItems, setCartItems] = useState<CartItem[]>([
//       // {
//       //       id: 1,
//       //       name: "Premium Wireless Headphones",
//       //       price: 199.99,
//       //       quantity: 1,
//       //       image: "/placeholder.svg?height=100&width=100",
//       //       selected: true
//       // },
//       // {
//       //       id: 2,
//       //       name: "Smartphone Case",
//       //       price: 24.99,
//       //       quantity: 2,
//       //       image: "/placeholder.svg?height=100&width=100",
//       //       selected: true
//       // },
//       // {
//       //       id: 3,
//       //       name: "USB-C Charging Cable",
//       //       price: 14.99,
//       //       quantity: 1,
//       //       image: "/placeholder.svg?height=100&width=100",
//       //       selected: true
//       // }
//       // ])

//       const handleQuantityChange = (id: number, increment: boolean) => {
//       setCartItems(items =>
//             items.map(item =>
//             item.id === id
//             ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
//             : item
//             )
//       )
//       }

//       const handleDeleteItem = (id: number) => {
//       setCartItems(items => items.filter(item => item.id !== id))
//       }

//       const handleSelectItem = (id: number) => {
//       setCartItems(items =>
//             items.map(item =>
//             item.id === id ? { ...item, selected: !item.selected } : item
//             )
//       )
//       }

//       const calculateTotal = () => {
//       return cartItems
//             .filter(item => item.selected)
//             .reduce((total, item) => total + item.price * item.quantity, 0)
//       }

//       const selectedItemsCount = cartItems.filter(item => item.selected).length

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({cartItems.length} items)</h1>
//           <span className="text-sm text-gray-500">
//             {selectedItemsCount} items selected
//           </span>
//         </div>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Cart Items List */}
//           <div className="lg:w-2/3">
//             <div className="bg-white rounded-lg shadow">
//               {cartItems.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
//                   <p className="mt-4 text-gray-500">Your cart is empty</p>
//                 </div>
//               ) : (
//                 <ul className="divide-y divide-gray-200">
//                   {cartItems.map((item) => (
//                     <li key={item.id} className="p-6">
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={item.selected}
//                           onChange={() => handleSelectItem(item.id)}
//                           className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
//                         />
//                         <div className="ml-4 flex-shrink-0">
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="h-16 w-16 rounded-md object-cover"
//                           />
//                         </div>
//                         <div className="ml-6 flex-1">
//                           <div className="flex items-center justify-between">
//                             <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
//                             <p className="ml-4 text-sm font-medium text-gray-900">
//                               ${(item.price * item.quantity).toFixed(2)}
//                             </p>
//                           </div>
//                           <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
//                           <div className="mt-4 flex items-center justify-between">
//                             <div className="flex items-center border rounded-md">
//                               <button
//                                 onClick={() => handleQuantityChange(item.id, false)}
//                                 className="p-2 hover:bg-gray-100"
//                               >
//                                 <Minus className="h-4 w-4 text-gray-500" />
//                               </button>
//                               <span className="px-4 py-2 text-gray-600">{item.quantity}</span>
//                               <button
//                                 onClick={() => handleQuantityChange(item.id, true)}
//                                 className="p-2 hover:bg-gray-100"
//                               >
//                                 <Plus className="h-4 w-4 text-gray-500" />
//                               </button>
//                             </div>
//                             <button
//                               onClick={() => handleDeleteItem(item.id)}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               <Trash2 className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:w-1/3">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
//               <div className="flow-root">
//                 <dl className="-my-4 text-sm divide-y divide-gray-200">
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-gray-600">Selected items</dt>
//                     <dd className="font-medium text-gray-900">{selectedItemsCount}</dd>
//                   </div>
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-gray-600">Subtotal</dt>
//                     <dd className="font-medium text-gray-900">${calculateTotal().toFixed(2)}</dd>
//                   </div>
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-gray-600">Shipping</dt>
//                     <dd className="font-medium text-gray-900">$10.00</dd>
//                   </div>
//                   <div className="py-4 flex items-center justify-between">
//                     <dt className="text-base font-medium text-gray-900">Order total</dt>
//                     <dd className="text-base font-medium text-gray-900">
//                       ${(calculateTotal() + 10).toFixed(2)}
//                     </dd>
//                   </div>
//                 </dl>
//               </div>
//               <button
//                 className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 onClick={() => console.log('Proceed to checkout')}
//                 disabled={selectedItemsCount === 0}
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }