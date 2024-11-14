import { Link } from "react-router-dom";
import { Product } from "../types/types";
import AddToCartBtn from "./AddToCartBtn";
import { useEffect, useState } from "react";

interface Props {
      product: Product;
}

const ProductCard = ({ product }: Props) => {
      const { id, name, image } = product;
      const [productImg, setProductImg] = useState<string>('');

      useEffect(() => {
            const imgUrl = (image as string)?.includes('uploads') ? 'http://localhost:5000/' + image : image as string;
            setProductImg(imgUrl);
      }, []);

      return (
            <Link to={`/products/${id}/detail`} >
                  <div className="shadow-md p-4 border-r-2 cursor-pointer">
                        <div className="flex flex-col justify-between h-full">
                              <img src={productImg} alt="" className="h-48 mx-auto object-contain" />
                              <h5 className="my-2 flex-1">{name}</h5>
                              <AddToCartBtn productId={id} />
                        </div>
                  </div>
            </Link>
      )
}

export default ProductCard;