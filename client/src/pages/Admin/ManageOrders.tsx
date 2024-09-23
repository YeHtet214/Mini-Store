// import { useEffect, useState } from "react";
// import OrdersTable from "../../components/Admin Components/OrdersTable";
// import { UseOrders } from "../../context/OrderContextProvider";
// import { OrderItemType } from "../../types/types";

// const ManageOrders = () => {
//     const { orders, orderItems } = UseOrders();
//     const [orderItemsByOrder, setOrderItemsByOrder] = useState<OrderItemType[][]>([]);

//     useEffect(() => {
//         (function() {
//             const orderIds = orders.map(order => order.order_id);
//             const groupedItemsByOrderId = orderIds.map(id => orderItems.filter(item => item.order_id === id));
//             console.log(groupedItemsByOrderId);
//             setOrderItemsByOrder(groupedItemsByOrderId);
//         })();
//     }, [orders]);

//     return (
//         <div className="">
//             <h1>Manage Orders</h1>
//             <OrdersTable />
//         </div>
//     )
// }

// export default ManageOrders;

import React, { ChangeEvent, useState } from "react";
import { UseOrders } from "../../context/OrderContextProvider";
import * as OrderServices from "../../services/Order.service";
import { AdminOrder } from "../../types/types";

const ManageOrders = () => {
    const  { orders, orderItems, setOrders } = UseOrders();
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const handleOrderExpandtion = (order_id: number) => {
        setExpandedOrder(expandedOrder => expandedOrder === order_id ? null : order_id);
    }

    const handleOrderStatusUpdate = async (e: ChangeEvent<HTMLSelectElement>, orderId: number) => {
        const updatedOrder = await OrderServices.updateOrderState(orderId, e.target.value);
        if (!updatedOrder) return;
        setOrders(orders => [...orders.filter(order => order.order_id !== orderId), updatedOrder])
    }

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
                                <td>
                                    <select name="status" id="status" value={order.status} onChange={(e) => handleOrderStatusUpdate(e, order.order_id)}>
                                        <option value="compeleted">Completed</option>
                                        <option value="pending">Pending</option>
                                    </select>
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

export default ManageOrders;