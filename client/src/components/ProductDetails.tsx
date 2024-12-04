import { useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContextProvider";
import AddToCartBtn from "./AddToCartBtn";
import { useEffect, useState } from "react";
import { Product } from "../types/types";

const ProductDetails = () => {
      const { id } = useParams();
      const { products } = useProduct();
      const [ targetProduct, settargetProduct ] = useState<Product | null>(() => products?.find(pro => pro.id === Number(id)) || null)
      const [ imgUrl, setImgUrl ] = useState<string>("");

      useEffect(() => {
            (() => {
                  if (!targetProduct || !id) return;
                  const url = (targetProduct.image.toString())?.includes('uploads') ? 'http://localhost:5000/' + targetProduct.image : targetProduct.image;
                  setImgUrl(url as string);
            })();
            settargetProduct(() => products?.find(pro => pro.id === Number(id)) || null)
      }, [id]);

      if (!targetProduct) return <h1>Target Product Not Exist!</h1>

      return (
        <div className="container mx-auto px-4 py-6 md:px-10 lg:px-16 xl:px-24">
              {imgUrl && (
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 items-center bg-white p-4 rounded-md shadow-sm">
                      <img src={imgUrl} alt={`${imgUrl}, image`} className="object-contain aspect-square mx-auto" />
                      <div className="flex-1 items-center">
                            <h2 className="font-semibold text-2xl text-gray-700 mb-4">{targetProduct.name}</h2>
                            <p className="">{targetProduct.description}</p>
                            <div
                              className="flex justify-between items-center mt-2 border-t-2 border-gray-500 gap-4 pt-4">
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