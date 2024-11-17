import { Link } from "react-router-dom";
import { Product } from "../types/types";
import AddToCartBtn from "./AddToCartBtn";
import { useEffect, useState } from "react";
import {StarIcon, ShoppingCartIcon, HeartIcon} from "lucide-react";
import {currency} from "../helper/helper.ts";

interface Props {
      product: Product;
}

const ProductCard = ({ product }: Props) => {
      const { id, name, image } = product;
      const [productImg, setProductImg] = useState<string>('');
      const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

      useEffect(() => {
            const imgUrl = (image as string)?.includes('uploads') ? 'http://localhost:5000/' + image : image as string;
            setProductImg(imgUrl);
      }, []);

      return (
            // <Link to={`/products/${id}/detail`} >
            //       <div className="shadow-md p-4 border-r-2 cursor-pointer">
            //             <div className="flex flex-col justify-between h-full">
            //                   <img src={productImg} alt="" className="h-48 mx-auto object-contain" />
            //                   <h5 className="my-2 flex-1">{name}</h5>
            //                   <AddToCartBtn productId={id} />
            //             </div>
            //       </div>
            // </Link>

          <Link to={`/products/${id}/detail`}>
                <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                >
                      <div className="relative">
                            <img
                                src={productImg}
                                alt={product.name}
                                className="w-full h-64 object-contain"
                            />
                            {hoveredProduct === product.id && (
                                <div className="absolute top-4 right-4 space-y-2">
                                      <button
                                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                                            <HeartIcon className="h-5 w-5 text-gray-600"/>
                                      </button>
                                </div>
                            )}
                            <div className="absolute bottom-4 left-4">
                  <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {product.category}
                  </span>
                            </div>
                      </div>
                      <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                        {product.name}
                                  </h3>
                                  <div className="flex items-center">
                                        <StarIcon className="h-5 w-5 text-yellow-400 fill-current"/>
                                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                                  </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-4">
                                  {currency.format(product.price)}
                            </p>
                            <AddToCartBtn productId={id}/>
                      </div>
                </div>
          </Link>


      )
}

export default ProductCard;