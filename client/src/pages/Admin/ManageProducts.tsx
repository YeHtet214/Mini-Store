import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useProduct } from "../../context/ProductContextProvider";
import { Product } from "../../types/types";
import { PlusIcon, PencilIcon, TrashIcon, Search, XIcon } from 'lucide-react'
import * as ProductServices from "../../services/Product.service";

interface InputProductFormProps {
  type: string;
  close: () => void;
  handleProductSubmit: (data: Product | NewProductType) => void;
  product: Product | null
}

interface NewProductType {
  name: string;
  price: number;
  description: string;
  image: string | File;
  stock: number;
  category: string;
  rating: number;
}

const initialNewProduct: NewProductType = { 
  name: "",
  price: 0,
  description: "",
  image: "",
  stock: 0,
  category: "",
  rating: 0
}

const InputProductForm = ({ type, close, handleProductSubmit, product }: InputProductFormProps) => {
  const [ productData, setProductData ] = useState<Product | NewProductType>(() => product || initialNewProduct);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value, name, type } = e.target;
      if ( type === "file") { 
        const files = (e.target as HTMLInputElement).files;
        if (files && files[0]) {
          setProductData(prev => ({...prev, image: files[0]}))
        }
      } else {
        setProductData(prev => ({ ...prev, [name]: value }));
      }
        
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleProductSubmit(productData);
      setProductData(initialNewProduct);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
        <div className="bg-gray-500 p-6">
          <h2 className="text-2xl font-bold text-white">
            { type === "Create" 
                ? <span>Enter New Product Data</span>
                : <span>Update Product</span>
            }
          </h2>
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <XIcon size={24} />
          </button>
        </div>
        <form className="p-6 space-y-4 text-left" onSubmit={(e) => handleSubmit(e)}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Olive Oil"
              required={type === "Create" ? true : false}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="$1234"
              required={type === "Create" ? true : false}
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="text"
              id="stock"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1324"
              required={type === "Create"}
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1324"
              required={type === "Create"}
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              { type === "Create" ? "Add Product" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )   
}

export default function ManageProduct() {
  const { products, deleteProduct, addNewProduct, updateProduct } = useProduct();
  const [displayProducts, setDisplayProducts] = useState<Product[] | []>(products);
  const [sortedProducts, setSortedProducts] = useState<Product[] | []>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("name");
  const [formType, setFormType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string>('');

useEffect(() => {
    (() => {
        if (!products) return;

        let sortedResult: Product[] = [...products];
        switch (selectedType) {
            case "name":
                sortedResult.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "category":
                sortedResult.sort((a, b) => a.category.localeCompare(b.category));
                break;
            case "price":
                sortedResult.sort((a, b) => a.price - b.price); // Sort by price (lowest to highest)
                break;
            case "id":
              sortedResult.sort((a, b) => a.id - b.id); // Sort by price (lowest to highest)
              break;
            default:
                sortedResult = products;
                break;
        }
        setSortedProducts(sortedResult);
        setDisplayProducts(sortedResult);
    })();
}, [selectedType, products]);

const handleFilter = (search: string) => {
  const filteredProducts = sortedProducts.filter(product => {
    return product.name?.toLowerCase().includes(search.toLocaleLowerCase()) ||
            String(product.price)?.includes(search.toLowerCase()) ||
            String(product.id)?.includes(search.toLowerCase()) ? product : null
  });
  setDisplayProducts(filteredProducts);
  setSearchTerm(search);
}

const openModal = (type: "Create" | "Update", id?: number) => {
    setIsModalOpen(true)
    setFormType(type);
    if (id) setCurrentProduct(() => products.find(pro => pro.id === id) || null);
}

  const closeModal = () => {
    setCurrentProduct(null)
    setIsModalOpen(false)
  }

const handleDeleteProduct = async (id: number) => {
    const deletedProduct = await ProductServices.deleteProduct(id);
    if (deletedProduct.success) {
        deleteProduct(id);
    } else {
        setError(deletedProduct.message);
    }
}

const handleCreateProduct = async (data: Product) => {
  const createdProduct = await ProductServices.uploadNewProduct(data);
  addNewProduct(createdProduct);
  closeModal();
}

const handleUpdateProduct = async (data: Product) => {
  const updatedProduct = await ProductServices.updateProduct(data);
  updateProduct(updatedProduct);
  closeModal();
}

  document.addEventListener('keydown', event => {
    if (event.key === "Escape") closeModal();
  })

  if (error) return <h1 className="absolute z-10 bg-white top-10 left-10 p-10 shadow-md">{error}</h1>;

  return (
    <div>
        <h1 className="text-2xl font-bold mb-6">Product Management</h1>
        <div className="grid grid-cols-4 gap-4">
          <select name="sort" className="col-span-4 md:col-span-1 h-10 cursor-pointer border rounded-lg px-2 text-md" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="id">Id</option>
            <option value="price">Price</option>
          </select>
            <div className="relative col-span-3 md:col-span-2">
                <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:border-indigo-700 focus:border-2 outline-none"
                value={searchTerm}
                onChange={(e) => handleFilter(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
                onClick={() => openModal("Create")}
                className="col-span-1 md:col-span-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 mb-6 rounded inline-flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add&nbsp; <span className="hidden md:block">Product</span>
          </button>
        </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {displayProducts?.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {product.id}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {product.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <img src={(product.image as string)?.includes('uploads') ? 'http://localhost:5000/' + product.image : product.image as string} alt="Product Image" className="object-contain w-8" />
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {product.category}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  ${product.price}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {product.stock}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => openModal("Update", product.id)}
                    className="text-indigo-600 hover:text-blue-900 mr-3"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-[90%] md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
                { isModalOpen && 
                  <InputProductForm 
                    type={formType} 
                    handleProductSubmit={(data: Product | NewProductType) => formType==="Create" ? handleCreateProduct(data as Product) : handleUpdateProduct(data as Product) } 
                    close={() => closeModal()}
                    product={currentProduct}
                  />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
