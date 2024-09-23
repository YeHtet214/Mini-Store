import express from "express";
import * as OrderService from "../services/orderService.js";

const router = express.Router();

router.get("/", async (req, res) => {
      const orders = await OrderService.getAllOrders();
      res.json(orders);
});

router.get("/items", async (req, res) => {
      const orderItems = await OrderService.getAllOrderItems();
      res.json(orderItems);
});

router.post("/", async (req, res) => {
      const { userId, totalAmount } = req.body;
      const order = await OrderService.createNewOrder({ userId, totalAmount });
      res.json(order);
})

router.post("/:orderId/add", async (req, res) => {
      const orderId = req.params.orderId;
      const items = req.body;
      if (orderId && items) {
            OrderService.addOrderItems(orderId, req.body)
      } 
})

router.put("/:orderId/update", async (req, res) => {
      const orderId = req.params.orderId;
      const status = req.body.value;
      console.log("ORder Id & status: ", orderId, status);
      const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
      console.log(updatedOrder);
      res.json(updatedOrder);
})

router.delete("/:orderId/delete", async (req, res) => {
      const orderId = req.params.orderId;
      const deletedOrderId = await OrderService.deleteOrder(orderId);
      console.log("Delete Order ID: ", deletedOrderId);
      res.json(deletedOrderId);
})

export default router;