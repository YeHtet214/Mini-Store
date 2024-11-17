import { useProduct } from "../context/ProductContextProvider";
import ProductCard from "../components/ProductCard";
import {useEffect, useState} from "react";
import { useUser } from "../context/UserContextProvider";
import LoadingDots from "../components/LoadingDots.tsx";
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";

const ProductsList = () => {
      const { products, isLoading } = useProduct();
      const { setIsLoggedIn } = useUser();
      const [searchQuery, setSearchQuery] = useState('')

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

      const filteredProducts = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )

      if (isLoading) return <LoadingDots />

      return (
          <div>
                {/*<h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>*/}
                <div className="bg-white shadow-sm sticky top-0 z-10">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                            <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400"/>
                                  </div>
                                  <input
                                      type="text"
                                      className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 focus:outline-none transition-colors"
                                      placeholder="Search products by name or category..."
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                  />
                            </div>
                      </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                      {filteredProducts?.map((product) => (
                          <ProductCard key={product.id} product={product}/>
                      ))}
                </div>
          </div>
      )
}

export default ProductsList;