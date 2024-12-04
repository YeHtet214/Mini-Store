import { Link } from "react-router-dom";
import { Product } from "../types/types";
import AddToCartBtn from "./AddToCartBtn";
import { useEffect, useState } from "react";
import {StarIcon, HeartIcon} from "lucide-react";
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
          <Link to={`/products/${id}/detail`}>
                <div
                    key={product.id}
                    className="bg-white rounded shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden p-4"
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                >
                      <div className="relative">
                            <img
                                src={productImg}
                                alt={name}
                                className="aspect-square object-contain"
                            />
                            {hoveredProduct === id && (
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
                      <div>
                            <div className="flex items-center justify-between mb-2">
                                  <h3 className=" text-gray-900 line-clamp-1">
                                        {name}
                                  </h3>
                                  <div className="flex items-center">
                                        <StarIcon className="h-3 w-5 text-yellow-400 fill-current"/>
                                        <span className="ml-1 text-gray-600">{product.rating}</span>
                                  </div>
                            </div>
                            <p className="text-xl font-bold text-gray-900 mb-4">
                                  {currency.format(product.price)}
                            </p>
                            <AddToCartBtn productId={id}/>
                      </div>
                </div>
          </Link>


      )
}

export default ProductCard;