import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
// import { Order, OrderItems } from "../types/types";
import * as OrderServices from "../services/Order.service";
import { Order, OrderItemType } from "../types/types";

interface OrderContextType {
    orders: Order[] | [];
    setOrders: Dispatch<SetStateAction<Order[] | []>>;
    addNewOrder: (order: Order) => void;
    updateOrderStatus: (order: Order) => void;
    deleteOrder: (order: number) => void;
    orderItems: OrderItemType[] | [];
    addNewOrderItems: (item: OrderItemType) => void;
}

const OrderContext = createContext<OrderContextType>({
    orders: [], 
    orderItems: [],
    setOrders: () => {},
    addNewOrder: () => {},
    updateOrderStatus: () => {},
    deleteOrder: () => {},
    addNewOrderItems: () => {}
});

const OrderContextProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
    const [orderItems, setOrderItems] = useState<OrderItemType[] | []>([]);
    const [orders, setOrders] = useState<Order[] | []>([]);

    useEffect(() => {
        const getAllOrders = async () => {
            const allOrders = await OrderServices.getAllOrders() as Order[];
            if (allOrders) setOrders(allOrders.sort((a, b) => a.order_id - b.order_id));
        }
        
        const getAllOrderItems = async () => {
            const allOrderItems = await OrderServices.getAllOrderItems();
            if (allOrderItems) setOrderItems(allOrderItems);
        }
        getAllOrders();
        getAllOrderItems();
    }, []);

    const addNewOrder = (order: Order) => {
        setOrders(prev => [...prev, order]);
    }

    const updateOrderStatus = (updatedOrder: Order) => {
        setOrders(prevOrders => 
            [...prevOrders.filter(order => order.order_id !== updatedOrder.order_id), updatedOrder]
            .sort((a, b) => a.order_id - b.order_id)
        )
    }

    const deleteOrder = (deletedOrderId: number) => {
        setOrders(prevOrders => 
            prevOrders
                .filter(order => order.order_id !== deletedOrderId)
                // .sort((a, b) => a.order_id - b.order_id)
        )
    }

    const addNewOrderItems = (newItem: OrderItemType) => {
        setOrderItems(items => [...items, newItem]);
    }

    return (
        <OrderContext.Provider value={{ orders, setOrders, orderItems, addNewOrder, updateOrderStatus, deleteOrder, addNewOrderItems }}>
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