import React, { ChangeEvent, Dispatch, FC, FormEvent, SetStateAction, useEffect, useState } from "react";
import { useProduct } from "../../context/ProductContextProvider";
import { Product } from "../../types/types";
import { XMarkIcon } from "@heroicons/react/16/solid";
import * as ProductServices from "../../services/Product.service";

interface NewProductType {
    name: string;
    category: string;
    price: number;
    stock: number;
    image: File | null;
    description: string;
}

interface ProductTableProps {
    sortedProducts: Product[] | [];
    deleteProduct: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleProductUpdate: (p: Product) => void;
}

interface NewProductFormType {
    addNewProduct: (e: FormEvent) => void;
    newProduct: NewProductType;
    setNewProduct: Dispatch<SetStateAction<NewProductType>>;
    setToggleForm: Dispatch<SetStateAction<boolean>>;
}

interface UpdateProductFormProps {
    product: Product;
    onUpdate: (p: Product) => void;
}

const ProductTable: FC<ProductTableProps> = ({ sortedProducts, deleteProduct, handleProductUpdate }) => (
    <table className="border-2 border-pink-50">
        <thead>
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
            </tr>
        </thead>
        <tbody>
            { sortedProducts?.map(product => {
                return (
                    <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{50}</td>
                        <td><button className="bg-blue-700 text-white py-1 px-2 rounded" onClick={() => handleProductUpdate(product)}>Update</button></td>
                        <td><button className="border-red-600 border-2 py-1 px-2 rounded" value={product.id} onClick={deleteProduct}>Delete</button></td>
                    </tr>
                )
            })}
        </tbody>
    </table>
)

const NewProductForm = ({ addNewProduct, newProduct, setNewProduct, setToggleForm }: NewProductFormType) => (
    <form className="relative" onSubmit={addNewProduct}>
        <h1>Enter Product Data</h1>
        <XMarkIcon className="w-6 absolute right-4 top-2 cursor-pointer" onClick={() => setToggleForm(false)} />
        <input type="text" name="name" autoFocus value={newProduct.name} placeholder="Product Name" onChange={(e) => setNewProduct(newProduct => ({...newProduct, name: e.target.value}))} required />
        <input type="text" name="category" value={newProduct.category} placeholder="Category" onChange={(e) => setNewProduct(newProduct => ({...newProduct, category: e.target.value}))} required />
        <input type="number" name="price" value={newProduct.price} placeholder="Price" onChange={(e) => setNewProduct(newProduct => ({...newProduct, price: Number(e.target.value)}))} required />
        <input type="text" name="description" value={newProduct.description} placeholder="Description" onChange={(e) => setNewProduct(newProduct => ({...newProduct, description: e.target.value}))} />
        <input type="number" name="stock" value={newProduct.stock} placeholder="Stock" onChange={(e) => setNewProduct(newProduct => ({...newProduct, stock: Number(e.target.value)}))} />
        <input type="file" name="image" accept="image/*" placeholder="Upload Product Image" onChange={(e) => setNewProduct(newProduct => ({...newProduct, image: e.target.files && e.target.files[0]}))} required />
        <button type="submit">Add</button>
    </form>
);

const UpdateProductForm: FC<UpdateProductFormProps> = ({ product, onUpdate }) => {
    const [updatedProduct, setUpdatedProduct] = useState<Product>(product);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedProduct(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = async () => {
        onUpdate(updatedProduct);
        await ProductServices.updateProduct(updatedProduct);
    }

    return (
        <form onSubmit={() => handleSubmit()}>
            <input type="text" value={updatedProduct.name} name="name" onChange={handleChange} />
            <input type="number" value={updatedProduct.price} name="price" onChange={handleChange} />
            <input type="number" value={updatedProduct.stock} name="stock" onChange={handleChange} />
            <input type="text" value={updatedProduct.description} name="description" onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    )
}

const ManageProducts = () => {
    const { products, setProducts } = useProduct();
    const [sortedProducts, setSortedProducts] = useState<Product[] | []>([]);
    const [selectedType, setSelectedType] = useState<string>("name");
    const [toggleForm, setToggleForm] = useState<boolean>(false);
    const [newProduct, setNewProduct] = useState<NewProductType>({name: "", category: "", price: 0, stock: 0, image: null, description: "" });
    const [productToUpdate, setProductToUpdate] = useState<Product | null>(null);
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log(sortedProducts);
        const sortProducts = () => {
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
                default:
                    sortedResult = products;
                    break;
            }
            setSortedProducts(sortedResult);
        }
        if (products) sortProducts();
        
    }, [selectedType, products]);

    const handleSorting = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value);
    }

    const handleAddProductSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!newProduct.image) return;

        const formData = new FormData();
        formData.append("name", newProduct.name);
        formData.append("category", newProduct.category);
        formData.append("price", String(newProduct.price));
        formData.append("stock", String(newProduct.stock));
        formData.append("image", newProduct.image);
        formData.append("description", newProduct.description);

        console.info("Product Form Data: ", formData);

        await ProductServices.uploadNewProduct(formData); // Upload New Product into the Database
        setNewProduct({name: "", category: "", price: 0, stock: 0, image: null, description: "" }); // set to initial state [empty the input value]
    }

    const handleDeleteProduct = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const productId = e.target.value;

        const deletedProduct = await ProductServices.deleteProduct(productId);
        if (deletedProduct.success) {
            setProducts(products => products?.filter(pro => pro.id !== deletedProduct.id));
        } else {
            setError(deletedProduct.message);
        }
    }

    const handleProductUpdate = (product: Product) => {
        setProductToUpdate(product);
        setShowUpdateForm(true);
    }

    return (
        <div className="pb-10 relative">
            { error && <h1 className="absolute z-10 bg-white top-10 left-10 p-10 shadow-md">{error}</h1> }
            <div>
                <h1>Products List</h1>
                <select name="sort" id="sortProduct" value={selectedType} onChange={handleSorting}>
                    <option value="name">Name</option>
                    <option value="category">Category</option>
                    <option value="price">Price</option>
                </select>
            </div>
            <div className="max-h-[65vh] max-w-[70vw] overflow-y-scroll">
                <ProductTable sortedProducts={sortedProducts} deleteProduct={handleDeleteProduct} handleProductUpdate={handleProductUpdate} />
            </div>
            
            {/* // Add New Product  */}
            <button className="border-red-600 border-2 py-1 px-2 rounded" onClick={() => setToggleForm(true)}>Add Product</button>
            { toggleForm && <NewProductForm addNewProduct={handleAddProductSubmit} newProduct={newProduct} setNewProduct={setNewProduct} setToggleForm={setToggleForm} /> }

            {/* Update the Product */}
            { showUpdateForm && productToUpdate && (
                <UpdateProductForm
                    product={productToUpdate}
                    onUpdate={(updatedProduct) => {
                        setProducts(products => products?.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                        setShowUpdateForm(false);
                        setProductToUpdate(null);
                    }}
                />
            )}
        </div>
    )
}

export default ManageProducts;





