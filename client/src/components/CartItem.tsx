import { CartItemType } from '../types/types';
import * as CartServices from '../services/Cart.service';
import { removeLeadingZero } from '../helper/helper';
import { useCart } from '../context/CartContextProvider';
import { TrashIcon } from '@heroicons/react/24/outline';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Props {
      item: CartItemType;
      itemList: CartItemType[] | [];
      setItemList: Dispatch<SetStateAction<CartItemType[]>>;
}

const CartItem = ({ item, setItemList }: Props) => {
      const { cartItems, setCartItems } = useCart();
      const [checkout, setCheckOut] = useState<boolean>(false);
      const [productImg, setProductImg] = useState<string>('');

      useEffect(() => {
            const imgUrl = item.image.includes('uploads') ? 'http://localhost:5000/' + item.image : item.image;
            setProductImg(imgUrl);
      }, []);

      useEffect(() => {
            handleSelect(checkout);
      }, [cartItems])
      
      const handleInputQuantity = async (input: HTMLInputElement) => {
            const [value, first] = [Number(input.value), Number(input.value[0])];
            const formattedQty = removeLeadingZero(value, first);
            input.value = String(formattedQty);
            const updateCartItems = await CartServices.updateCart('updateCartItemQty', item.product_id, item.id, formattedQty);
            setCartItems(updateCartItems);
      }

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

      const handleSelect = (selected: boolean) => {
            setCheckOut(selected);
            selected ? setItemList(oldItems => {
                  const uniqueArr = oldItems.filter(existingItem => existingItem.product_id !== item.product_id);
                  return [...uniqueArr, item];
            }) : setItemList(prevItems => {
                  const updateCheckOutItems = prevItems.filter(prev => prev.id !== item.id)
                  return updateCheckOutItems;
            });
      }

      const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            handleSelect(e.target.checked);
      }

      if (!item) return;
      return (
            <div className='mb-4'>
                  <input type="checkbox" checked={checkout} onChange={handleCheckBoxChange} />
                  <img src={productImg} alt="Product Image" width={100} />
                  <div>
                        <h3>{item.name}</h3><br />
                        <b>${item.price}</b>
                        <p>{item.description}</p>
                  </div>
                  <div className='flex justify-between'>
                        <div>
                              <span onClick={() => handleUpdateCartItemQty(-1)} >-</span>
                              <input type="number" value={item.quantity} onChange={e => handleInputQuantity(e.target as HTMLInputElement)} className="w-6 text-center border-2 border-green-50" />
                              <span onClick={() => handleUpdateCartItemQty(1)} >+</span>
                        </div>
                        <TrashIcon className="w-7 inline ml-4 cursor-pointer" onClick={handleItemDelete} />
                  </div>
            </div>
      );
}     

export default CartItem;
