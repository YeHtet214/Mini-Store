import { client } from "../db/index.js";

export const getAllOrders = async () => {
      try {
            const { rows } = await client.query(`
                  SELECT order_id, name, orders.user_id, order_date, total_amount, status 
                  FROM orders
                  INNER JOIN users 
                  ON orders.user_id = users.user_id;
            `);
            return rows;
      } catch (error) {
            return { success: false, msg: "There is an error getting the orders: ", error};
      }
}

export const getAllOrderItems = async () => {
      try {
            const { rows } = await client.query(`
                  SELECT order_item_id, name, order_id, orderitems.price, orderitems.quantity, sub_total
                  FROM orderitems
                  INNER JOIN products 
                  ON orderitems.product_id = products.id;
            `);
            return rows;
      } catch (error) {
            return { success: false, msg: "There is an error getting the order items: ", error};
      }
}


export const createNewOrder = async ({ userId, totalAmount }) => {
      const query = `
            INSERT INTO orders (user_id, total_amount, status)
            VALUES ($1, $2, $3)
            RETURNING *
      `;

      try {
            const { rows } = await client.query(query, [userId, totalAmount, "pending"]);
            return rows[0];
      } catch (error) {
            console.log(error);
      }
}

export const addOrderItems = (orderId, items) => {
      const query = `
            INSERT INTO orderitems (order_id, product_id, price, quantity, sub_total)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
      `;

      try {
            items?.map(async (item) => {
                  await client.query(query, [orderId, item.product_id, item.price, item.quantity, item.quantity * item.price])
            })
      } catch (error) {
            console.log(error);
      }
}

export const updateOrderStatus = async (orderId) => {
      const query = `
            UPDATE orders SET status = $1
            WHERE order_id = $2;
      `;
      try {
            await client.query(query, ["completed", orderId]);
      } catch (error) {
            console.log(error);
            throw new Error(error);
      }
}