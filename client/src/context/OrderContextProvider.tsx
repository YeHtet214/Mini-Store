import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
// import { Order, OrderItems } from "../types/types";
import * as OrderServices from "../services/Order.service";
import { AdminOrder, OrderItemType } from "../types/types";

interface OrderContextType {
    orders: AdminOrder[] | [];
    setOrders: Dispatch<SetStateAction<AdminOrder[] | []>>;
    updateOrderStatus: (order: AdminOrder) => void;
    deleteOrder: (order: number) => void;
    orderItems: OrderItemType[] | [];
}

const OrderContext = createContext<OrderContextType>({
    orders: [], 
    orderItems: [],
    setOrders: () => {},
    updateOrderStatus: () => {},
    deleteOrder: () => {}
});

const OrderContextProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
    const [orderItems, setOrderItems] = useState<OrderItemType[] | []>([]);
    const [orders, setOrders] = useState<AdminOrder[] | []>([]);

    useEffect(() => {
        const getAllOrders = async () => {
            const allOrders = await OrderServices.getAllOrders() as AdminOrder[];
            if (allOrders) setOrders(allOrders.sort((a, b) => a.order_id - b.order_id));
        }
        
        const getAllOrderItems = async () => {
            const allOrderItems = await OrderServices.getAllOrderItems();
            if (allOrderItems) setOrderItems(allOrderItems);
        }
        getAllOrders();
        getAllOrderItems();
    }, []);

    const updateOrderStatus = (updatedOrder: AdminOrder) => {
        setOrders(prevOrders => 
            [...prevOrders.filter(order => order.order_id !== updatedOrder.order_id), updatedOrder]
            .sort((a, b) => a.order_id - b.order_id)
        )
    }

    const deleteOrder = (deletedOrderId: number) => {
        setOrders(prevOrders => 
            prevOrders
                .filter(order => order.order_id !== deletedOrderId)
                .sort((a, b) => a.order_id - b.order_id)
        )
    }

    return (
        <OrderContext.Provider value={{ orders, setOrders, orderItems, updateOrderStatus, deleteOrder }}>
            {children}
        </OrderContext.Provider>
    )
}

const UseOrders = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('Context Should Be Used Inside the Order Context Provider');
    return context;
}

export { OrderContextProvider, OrderContext, UseOrders };