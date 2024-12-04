import React, { useEffect, useState } from "react";
import { UseOrders } from "../../context/OrderContextProvider";
import * as OrderServices from "../../services/Order.service";
import { Order, OrderItemType } from "../../types/types";

import { Search, ChevronLeft, ChevronRight, Eye, Trash2, RefreshCw } from 'lucide-react'
import { currency } from "../../helper/helper";

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

interface orderItemsTableProps {
    items: OrderItemType[] | null;
}

const ConfirmModel = ({ onDelete, onCancel }) => (
  <div className="absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-100/50">
    <div className="bg-white p-8">
      <h1>Are you sure to delete the order</h1>
      <div className="flex items-center justify-center gap-4 mt-4 transition ease-in-out">
        <button className="py-1 px-4 border-indigo-500 border-2 rounded focus:scale-95" onClick={onCancel}>Cancel</button>
        <button className="py-1 px-4 border-red-500 bg-red-500 text-white border-2 rounded focus:scale-95" onClick={onDelete}>Ok</button>
      </div>
    </div>
  </div>
);

const OrderItemsTable = ({ items }: orderItemsTableProps) => {
  return (
    <div className="bg-gray-100">
      <div className="mb-4 grid grid-cols-5 border-b-2 border-gray-200 p-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
        <p>Order Item Id</p>
        <p>Name</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Sub Total</p>
      </div>
      {items?.map((item) => (
        <div key={item.order_item_id} className="grid grid-cols-5 text-sm">
          <p className="mx-4 inline-block">{item.order_item_id}</p>
          <p className="mr-4 inline-block max-w-80">{item.name}</p>
          <p>{item.price}</p>
          <p>{item.quantity}</p>
          <p>{currency.format(item.sub_total)}</p>
        </div>
      ))}
    </div>
  );
};

const ManageOrders = () => {
    const {orders, orderItems, deleteOrder} = UseOrders();
    const [currentOrders, setCurrentOrders] = useState<Order[]>(orders)
    const [filteredOrders, setFilteredOrders] = useState<Order[] | null>(null)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [currentOrderItems, setCurrentOrderItems] = useState<OrderItemType[] | null>(null)
    const [selectedOrderId, setSelectedOrderId] = useState<number>()
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [firstOrderIndex, setFirstOrderIndex] = useState(0)
    const [lastOrderIndex, setLastOrderIndex] = useState(0)
    const ordersPerPage = 5

    useEffect(() => {
        const filtered = orders.filter(order =>
            String(order.order_id).includes(searchTerm) ||
            order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(order.total_amount).includes(searchTerm)
        )

        const indexOfLastOrder = currentPage * ordersPerPage
        const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
        const currentOrders = filtered.slice(indexOfFirstOrder, indexOfLastOrder)
        setFirstOrderIndex(indexOfFirstOrder)
        setLastOrderIndex(indexOfLastOrder)
        setCurrentOrders(currentOrders)
        setFilteredOrders(filtered)

        const calcTotalPages = Math.ceil(filtered.length / ordersPerPage)
        setTotalPages(calcTotalPages)
    }, [searchTerm, currentPage, orders])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    const handleStatusUpdate = (id: number, newStatus: Order['status']) => {
        setCurrentOrders(orders.map(order =>
            order.order_id === id ? {...order, status: newStatus} : order
        ))
    }

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        // setOrdersList(orders.filter(order => order.order_id !== id))
        console.log("Delete order Id: ", id);
        const deletedOrder = await OrderServices.deleteOrder(id)
        if (deletedOrder) deleteOrder(id)
        handleCloseModal()

    }

    const handleOrderDetailView = (id: number) => {
        setOpenModal(true)
        if (id === selectedOrderId) {
            setOpenModal(false)
            setSelectedOrderId(0)
            return
        }
        const currentItems = orderItems.filter(item => item.order_id === id);
        setCurrentOrderItems(currentItems);
        setSelectedOrderId(id)
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrderId(0);
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

            <div className="mb-4 flex items-center">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20}/>
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full leading-normal">
                    <thead>
                    <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Order ID
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Customer
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Total
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentOrders.map((order) => (
                        <React.Fragment key={order.order_id}>
                            <tr>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {order.order_id}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {order.name}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {new Date(order.order_date).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {currency.format((order.total_amount))}
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order["order_status"]]}`}>
                            {order.order_status}
                            </span>
                                </td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center space-x-4">
                                        <button className="text-blue-600 hover:text-blue-900"
                                                onClick={() => handleOrderDetailView(order.order_id)}>
                                            <Eye size={18}/>
                                        </button>
                                        <button
                                            className="text-green-600 hover:text-green-900"
                                            onClick={() => handleStatusUpdate(order.order_id, 'Processing')}
                                        >
                                            <RefreshCw size={18}/>
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                          onClick={() => handleOrderDetailView(order.order_id)}
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {(openModal && (selectedOrderId === order.order_id)) ? ( // Show Order Items if view is clicked
                                <tr>
                                    <td colSpan={6}>
                                        <OrderItemsTable items={currentOrderItems}/>
                                    </td>
                                </tr>
                            ) : null}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    {filteredOrders && (
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{firstOrderIndex + 1}</span> to{' '}
                            <span className="font-medium">
                    {Math.min(lastOrderIndex, filteredOrders.length)}
                  </span>{' '}
                            of <span className="font-medium">{filteredOrders.length}</span> results
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        <ChevronLeft size={20}/>
                    </button>
                    <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        <ChevronRight size={20}/>
                    </button>
                </div>
            </div>

            { openModal && <ConfirmModel onDelete={() => handleDelete(selectedOrderId)} onCancel={() => handleCloseModal() } /> }
        </div>
    )
}

export default ManageOrders;

