import { CartItemType } from '../types/types';
import * as CartServices from '../services/Cart.service';
import { currency } from '../helper/helper';
import { useCart } from '../context/CartContextProvider';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
      item: CartItemType;
      itemList: CartItemType[] | [];
      setItemList: Dispatch<SetStateAction<CartItemType[]>>;
}

const CartItem = ({ item, setItemList }: CartItemProps) => {
      const { cartItems, setCartItems } = useCart();
      const [checkout, setCheckOut] = useState<boolean>(false);
      const [productImg, setProductImg] = useState<string>('');

      useEffect(() => {
            // Format the image URL if it's created by admin
            const imgUrl = item.image.includes('uploads') ? 'http://localhost:5000/' + item.image : item.image;
            setProductImg(imgUrl);
      }, [item.image]);

      useEffect(() => {
            handleSelectItem(checkout);
      }, [cartItems]);

      const handleUpdateCartItemQty = async (qty: number) => {
            const newQty = item.quantity + qty;
            if (newQty < 1) return;
            const updateCartItems = await CartServices.updateCart('updateCartItemQty',item.product_id, item.id, newQty);
            setCartItems(updateCartItems);
      }

      const handleItemDelete = async () => {
            const updateCartItems = await CartServices.updateCart('deleteCartItem',item.product_id, item.id, item.id);
            setCartItems(updateCartItems);
            // Once the item is removed from the cart, also remove from the checkout if exist in checkout list;
            setItemList(prevCheckOutItems => prevCheckOutItems.filter(existingItem => existingItem.product_id !== item.product_id));
      }

      const handleSelectItem = (selected: boolean) => {
            setCheckOut(selected);
            selected ? 
                  setItemList(prevItems => {
                        const uniqueArr = prevItems.filter(existingItem => existingItem.id !== item.id);
                        return [...uniqueArr, item]; // make sure to remove the same item if it's cached 
                  }) :
                  setItemList(prevItems => {
                        const updateCheckOutItems = prevItems.filter(existingItem => existingItem.id !== item.id)
                        return updateCheckOutItems;
                  });
      }

      // const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //       handleSelect(e.target.checked);
      // }

      if (!item) return;
      return (
            <div className="flex items-center">
                  <input
                        type="checkbox"
                        checked={checkout}
                        onChange={(e) => handleSelectItem(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="ml-4 flex-shrink-0">
                        <img
                              src={productImg}
                              alt={item.name}
                              className="h-16 w-16 rounded-md object-cover"
                        />
                  </div>
                  <div className="ml-6 flex-1">
                        <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="ml-4 text-sm font-medium text-gray-900">
                              {currency.format((item.price * item.quantity))}
                        </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">${item.price} each</p>
                  <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                              <button
                                    onClick={() => handleUpdateCartItemQty(-1)}
                                    className="p-2 hover:bg-gray-100"
                                    >
                                    <Minus className="h-4 w-4 text-gray-500" />
                              </button>
                              <span className="px-4 py-2 text-gray-600">{item.quantity}</span>
                              <button
                                    onClick={() => handleUpdateCartItemQty(1)}
                                    className="p-2 hover:bg-gray-100"
                                    >
                                    <Plus className="h-4 w-4 text-gray-500" />
                              </button>
                        </div>
                              <button
                                    onClick={handleItemDelete}
                                    className="text-red-500 hover:text-red-700"
                              >
                                    <Trash2 className="h-5 w-5" />
                              </button>
                        </div>
                  </div>
            </div>
      );
}     

export default CartItem;
