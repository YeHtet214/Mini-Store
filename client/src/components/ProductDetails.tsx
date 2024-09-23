import { useLocation } from "react-router-dom";
import { useProduct } from "../context/ProductContextProvider";
import AddToCartBtn from "./AddToCartBtn";
import { useEffect, useState } from "react";

const ProductDetails = () => {
      const { pathname } = useLocation();
      const [productImg, setProductImg] = useState<string>('');

      const id = Number(pathname.split('/')[2]);
      const { products } = useProduct();
      const targetProduct = products?.filter(prod => prod.id === id)[0];

      useEffect(() => {
            if (!targetProduct) return;
            const imgUrl = targetProduct.image.includes('uploads') ? 'http://localhost:5000/' + targetProduct.image : targetProduct.image;
            setProductImg(imgUrl);
      }, []);

      return (
            <div>
                 {targetProduct && (
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                              <div className="w-full p-10 md:w-1/2 md:p-0 lg:p-10">
                                    <img src={productImg} alt={`${productImg}, image`} className="max-w-80" />
                              </div>
                              <div className="flex-1">
                                    <h2 className="font-semibold text-2xl text-gray-700 mb-2">{targetProduct.name}</h2>
                                    <p>{targetProduct.description}</p>
                                    <div className="flex justify-between items-center mt-2 border-t-2 border-gray-500 pt-4">
                                          <i className="text-xl"><em><b>${targetProduct.price}</b></em></i>
                                          <AddToCartBtn productId={targetProduct.id} />
                                    </div>
                              </div>
                        </div>
                  )}
            </div>
      )
}

export default ProductDetails;