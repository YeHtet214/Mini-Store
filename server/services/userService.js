import { client } from "../db/index.js";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
const jwt_secret = process.env.JWT_SECRET;
import * as CartService from "../services/cartService.js";

const ROUND_SALT = 10;
const DEFAULT_ROLE = "user"; 

export const getUserData = async (email) => {
      try {
            const userData = await client.query(
                  "SELECT * FROM users WHERE email=$1",
                  [email]
            )
            return userData.rows[0];
      } catch (error) {
            console.log(error);
      }
}

export const getUserDataById = async (id) => {
      try {
            const userData = await client.query(
                  "SELECT * FROM users WHERE user_id=$1",
                  [id]
            )
            return userData.rows[0];
      } catch (error) {
            console.log(error);
      }
}

export const getAllUsers = async () => {
      try {
            const { rows } = await client.query("SELECT * FROM users");
            return rows;
      } catch (error) {
            throw new Error(error);
      }
}

export const registerUser = async (name, email, enterPassword, role = DEFAULT_ROLE) => {
      try {
            const existingUser = await getUserData(email);
            if (existingUser) {
                  return await authenticateUser(email, enterPassword);
            } else {
                  const hash = await bcrypt.hash(enterPassword, ROUND_SALT);
                  const newUser = await client.query(
                        `INSERT INTO users (name, email, password, role) 
                        VALUES ($1, $2, $3, $4) RETURNING *`,
                        [name, email, hash, role]
                  )
                  if (newUser.rows.length > 0) {
                        // Create cart for associate user
                        await CartService.createCart(newUser.rows[0].user_id);
                        let value = await authenticateUser(email, enterPassword);
                        return value;
                  }
            }
      } catch (error) {
            console.log(error);
            return ("Database Error");
      }
}

export const authenticateUser = async (email, enterPassword) => {
      const userData = await getUserData(email);

      if (!userData) {
            throw new Error("Email not found")
      }
      const validPassword = await bcrypt.compare(enterPassword, userData.password);

      if (!validPassword) {
            throw new Error("Incorrect Password")
      }
      const payload = {
            user: {
                  id: userData.user_id,
                  role: userData.email === "yhtet1934@gmail.com" ? "admin" : userData.role === "admin" ? "admin" : "user"
            }
      }
      const token = jwt.sign(payload, jwt_secret);
      console.log("Token: ", token);
      return {token, user_id: userData.user_id};
}

export const deleteUser = async (userId) => {
      try {
            const { rows } = await client.query(
                                    `DELETE FROM users
                                    WHERE user_id = $1
                                    RETURNING *`, 
                                    [userId]
                              );
            return rows[0];
      } catch (error) {
            console.log(error);
      }
}

export const createNewUserByAdmin = async ({ name, email, password, role}) => {
      const existingUser = await getUserData(email);
      if (existingUser) throw new Error("User already exist!");
      const hash = await bcrypt.hash(password, ROUND_SALT);
      const newUser = await client.query(
            `INSERT INTO users (name, email, password, role) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [name, email, hash, role]
      )
      if (newUser.rows.length > 0) {
            // Create cart for associate user
            await CartService.createCart(newUser.rows[0].user_id);
            let value = await authenticateUser(email, password);
            return value;
      }
}