import { UseOrders } from "../../context/OrderContextProvider"

const OrderItems = () => {
    const  { orderItems } = UseOrders();

    return (    
            <table>
                <thead>
                    <tr>
                        <th>Order Item Id</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Sub Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orderItems?.map(item => (
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
    )
}

export default OrderItems;