import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from "cors";
import session from 'express-session';
import passport from 'passport';
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";
import userManagementRoutes from "./routes/manageUsers.js";
import apiRoutes from "./routes/api.js";
import { fileURLToPath } from 'url';

const app = express()
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(session({
      secret: 'temp_secret_key',
      resave: false,
      saveUninitialized: true
}));

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
      res.send("Hello Backend")
})

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/manageUsers', userManagementRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => console.log("Server is running on port", PORT))