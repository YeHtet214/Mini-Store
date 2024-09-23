import express from "express";
import * as OrderService from "../services/orderService.js";

const router = express.Router();

router.get("/", async (req, res) => {
      const orders = await OrderService.getAllOrders();
      console.log("Orders: ", orders);
      res.json(orders);
});

router.get("/items", async (req, res) => {
      const orderItems = await OrderService.getAllOrderItems();
      console.log("Order Items: ", orderItems);
      res.json(orderItems);
});

router.post("/", async (req, res) => {
      const { userId, totalAmount } = req.body;
      const order = await OrderService.createNewOrder({ userId, totalAmount });
      res.json(order);
})

router.post("/:orderId/add", async(req, res) => {
      const orderId = req.params.orderId;
      const items = req.body;
      if (orderId && items) {
            OrderService.addOrderItems(orderId, req.body)
      } 
})

router.put("/:orderId/update", async(req, res) => {
      const orderId = req.params.orderId;
      console.log("Ordre Id: ", orderId)
      if (orderId) {
            OrderService.updateOrderStatus(orderId);
      }
      
})

export default router;