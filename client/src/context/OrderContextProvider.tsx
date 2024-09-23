import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useState } from "react";
// import { Order, OrderItems } from "../types/types";
import * as OrderServices from "../services/Order.service";
import { AdminOrder, OrderItemType } from "../types/types";

interface OrderContextType {
    orders: AdminOrder[] | [];
    setOrders: Dispatch<SetStateAction<AdminOrder[] | []>>;
    orderItems: OrderItemType[] | [];
}

const OrderContext = createContext<OrderContextType>({
    orders: [], 
    orderItems: [],
    setOrders: () => {}
});

const OrderContextProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
    const [orderItems, setOrderItems] = useState<OrderItemType[] | []>([]);
    const [orders, setOrders] = useState<AdminOrder[] | []>([]);

    useEffect(() => {
        const getAllOrders = async () => {
            const allOrders = await OrderServices.getAllOrders();
            if (allOrders) setOrders(allOrders);
        }
        const getAllOrderItems = async () => {
            const allOrderItems = await OrderServices.getAllOrderItems();
            if (allOrderItems) setOrderItems(allOrderItems);
        }
        getAllOrders();
        getAllOrderItems();
    }, []);

    return (
        <OrderContext.Provider value={{ orders, setOrders, orderItems }}>
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