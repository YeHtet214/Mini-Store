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

            if (token && user_id) {
                  localStorage.setItem("token", token);
                  localStorage.setItem("user_id", user_id);
                  setIsLoggedIn(true);
            }
      }, []);

      return (
            <>
                  {isLoading ? <h1>Loading...</h1> : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {
                                    products?.map(prod => (
                                          <ProductCard key={prod.id} product={prod} />
                                    ))
                              }
                        </div>
                        
                  )}
            </>
      )
}

export default ProductsList;