import { useProduct } from "../context/ProductContextProvider";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import { useUser } from "../context/UserContextProvider";

const ProductsList = () => {
      const { products, isLoading } = useProduct();
      const { setIsLoggedIn } = useUser();

      useEffect(() => {
            // For OAuth Authenticated Users return the token & user_id from the url 
            const queryParams = new URLSearchParams(window.location.search); 
            const token = queryParams.get("token");
            const user_id = queryParams.get("user_id");

            console.log(user_id, token, "query params");

            if (token && user_id) {
                  console.log("Inside if block", token, user_id)
                  localStorage.setItem("token", token);
                  localStorage.setItem("user_id", user_id);
                  setIsLoggedIn(true);
            }
      }, []);

      if (isLoading) return <h1>Loading...</h1>

      return (
            <div className="container mx-auto py-8 px-4">
                  <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products?.map((product) => (
                              <ProductCard key={product.id} product={product} />
                        ))}
                  </div>
            </div>
      )
}

export default ProductsList;