import React, { useState } from "react";
import { UseOrders } from "../../context/OrderContextProvider"

const OrdersTable = () => {
    const  { orders, orderItems } = UseOrders();
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const handleOrderExpandtion = (order_id: number) => {
        setExpandedOrder(expandedOrder => expandedOrder === order_id ? null : order_id);
    }

    return (
        <div>
            <table className="w-full">
                <thead>
                    <tr className="text-left">
                        <th>Order Id</th>
                        <th>User Name</th>
                        <th>User Id</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map(order => (
                        <React.Fragment key={order.order_id}>
                            <tr onClick={() => handleOrderExpandtion(order.order_id)} className="text-left cursor-pointer">
                                <td>{order.order_id}</td>
                                <td>{order.name}</td>
                                <td>{order.user_id}</td>
                                <td>{String(order.order_date)}</td>
                                <td>{order.total_amount}</td>
                                <td>{order.order_status}</td>
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
                                                        <tr>
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

export default OrdersTable;