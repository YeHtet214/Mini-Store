import React, { useEffect, useState } from "react";
import { UseOrders } from "../../context/OrderContextProvider";
import * as OrderServices from "../../services/Order.service";
import { Order, OrderItemType } from "../../types/types";

import { Search, ChevronLeft, ChevronRight, Eye, Trash2, RefreshCw } from 'lucide-react'
import { currency } from "../../helper/helper";
import { debounce } from "chart.js/helpers";

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Processing: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

interface orderItemsTableProps {
    items: OrderItemType[] | null;
}

const OrderItemsTable = ({ items }: orderItemsTableProps ) => {

    return (
      <div className="bg-gray-100">
        <div className="p-4 grid grid-cols-5 mb-4 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <p>Order Item Id</p>
          <p>Name</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Sub Total</p>
        </div>
        { items?.map(item => (
          <div key={item.order_item_id} className="grid grid-cols-5 text-sm" >
              <p className="inline-block mx-4">{item.order_item_id}</p>
              <p className="max-w-80 mr-4 inline-block">{item.name}</p>
              <p>{item.price}</p>
              <p>{item.quantity}</p>
              <p>{currency.format(item.sub_total)}</p>
          </div>
        ))}
      </div>
    )
}

export default function ManageOrders() {
    const { orders, orderItems, deleteOrder } = UseOrders();
    const [currentOrders, setCurrentOrders] = useState<Order[]>(orders)
    const [filteredOrders, setFilteredOrders] = useState<Order[] |null>(null)
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
        String(order.order_id).includes(searchTerm.toLowerCase()) ||
        order.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
    }, [searchTerm])

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value)
      setCurrentPage(1)
    }

    const handleSearchOrder = debounce((e) => handleSearch(e), 300)
  
    const handleStatusUpdate = (id: number, newStatus: Order['status']) => {
      setCurrentOrders(orders.map(order => 
        order.order_id === id ? { ...order, status: newStatus } : order
      ))
    }
  
    const handleDelete = async (id: number) => {
      // setOrdersList(orders.filter(order => order.order_id !== id))
      const deletedOrder = await OrderServices.deleteOrder(id)
      if (deletedOrder) deleteOrder(id)
      
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
  
    return (
      <div className="container mx-auto px-4 py-8">
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
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
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
                    <tr >
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
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                            </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex items-center space-x-4">
                            <button className="text-blue-600 hover:text-blue-900" onClick={() => handleOrderDetailView(order.order_id)}>
                                <Eye size={18} />
                            </button>
                            <button 
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handleStatusUpdate(order.order_id, 'Processing')}
                            >
                                <RefreshCw size={18} />
                            </button>
                            <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDelete(order.order_id)}
                            >
                                <Trash2 size={18} />
                            </button>
                            </div>
                        </td>
                    </tr>
                    { (openModal && ( selectedOrderId === order.order_id)) ? ( // Show Order Items if view is clicked
                        <tr>
                          <td colSpan={6}>
                            <OrderItemsTable items={currentOrderItems} />
                          </td>
                        </tr>
                    ) : null }
                </React.Fragment>
                
                
              ))}
            </tbody>
          </table>
          
        </div>
  
        <div className="mt-4 flex items-center justify-between">
          <div>
              { filteredOrders && (
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
              <ChevronLeft size={20} />
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    )

    // const  { orders, orderItems, updateOrderStatus, deleteOrder } = UseOrders();
    // const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
    // const [isDeleted, setIsDeleted] = useState<boolean>(false);

    // const handleOrderExpandtion = (order_id: number) => {
    //     setExpandedOrder(expandedOrder => expandedOrder === order_id ? null : order_id);
    // }

    // const handleOrderStatusUpdate = async (e: ChangeEvent<HTMLSelectElement>, orderId: number) => {
    //     const updatedOrder = await OrderServices.updateOrderState(orderId, e.target.value) as Order;
    //     console.log("Updated Status", updatedOrder.status);
    //     if (!updatedOrder) return;
    //     updateOrderStatus(updatedOrder);
    // }

    // const handleOrderDelete = async (e: React.MouseEvent<HTMLSpanElement>,orderId: number) => {
    //     e.stopPropagation();
    //     const deletedOrder = await OrderServices.deleteOrder(orderId);
    //     if (!deletedOrder) return;
    //     deleteOrder(orderId);
    //     setIsDeleted(false);
    // }

    return (
        <div>
            <h1>Manage Orders</h1>
            <table className="w-full">
                <thead>
                    <tr className="text-left">
                        <th>Order Id</th>
                        <th>User Name</th>
                        <th>User Id</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="relatvie">
                    { orders?.map(order => (
                        <React.Fragment key={order.order_id}>
                            <tr onClick={() => handleOrderExpandtion(order.order_id)} className="text-left cursor-pointer">
                                <td>{order.order_id}</td>
                                <td>{order.name}</td>
                                <td>{order.user_id}</td>
                                <td>{String(order.order_date)}</td>
                                <td>{order.total_amount}</td>
                                <td>
                                    <select name="status" id="status" value={order.status} onChange={(e) => handleOrderStatusUpdate(e, order.order_id)}>
                                        <option value="compeleted">Completed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => setIsDeleted(true)}>Delete</button>
                                    { isDeleted && (
                                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-4 bg-black text-white">
                                            Are u sure you want to delete this order? 
                                            <span onClick={(e) => handleOrderDelete(e, order.order_id)}>Yes</span>
                                            <span onClick={() => setIsDeleted(false)}>No</span>
                                        </div>
                                    )}
                                </td>
                            </tr>
                            <React.Fragment>
                                { expandedOrder === order.order_id && (
                                    <tr className="border border-red-50">
                                        <td colSpan={6} className="border">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left">
                                                        <th>Order Item Id</th>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Sub Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { orderItems.filter(item => item.order_id === order.order_id).map(item => (
                                                        <tr key={item.order_item_id}>
                                                            <td>{item.order_item_id}</td>
                                                            <td>{item.name}</td>
                                                            <td>{item.price}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>{item.sub_total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                            )}
                            </React.Fragment>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
        
    )
}

// export default ManageOrders;