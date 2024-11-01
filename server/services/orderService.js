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
            console.log("Created Order Summary: ", rows[0])
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

export const updateOrderStatus = async (orderId, status) => {
      const query = `
            UPDATE orders SET status = $1
            WHERE order_id = $2 RETURNING *;
      `;
      try {
            const { rows } = await client.query(query, [status, orderId]);
            console.log("Rows: ", rows);
            return rows[0];
      } catch (error) {
            console.log(error);
            throw new Error(error);
      }
}

export const deleteOrder = async (orderId) => {
      try {
            const { rows } = await client.query(`
                  DELETE FROM orders 
                  WHERE order_id = $1
                  Returning order_id
            `, [orderId]);
            return rows[0];
      } catch (err) {
            console.log(err);
            throw new Error(err);
      }
}

export const getMonthlyOrderTotal = async () => {
      try {
            const { rows } = await client.query(`
                  SELECT 
                        TO_CHAR(DATE_TRUNC('month', order_date), 'YYYY-MM') AS month,
                        SUM(total_amount) AS total_sales
                  FROM
                        orders
                  GROUP BY 
                        DATE_TRUNC('month', order_date)
                  ORDER BY 
                        month;`);
console.log(rows);
            return rows;
      } catch (error) {
            console.log(error);
      }
}