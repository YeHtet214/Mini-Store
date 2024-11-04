import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import ProductsList from "./pages/ProductsList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./routes/PrivateRoute";
import Profile from "./pages/Profile";
import CheckOut from "./pages/CheckOut";
import Dashboard from "./pages/Admin/Dashboard";
import ManageProducts from "./pages/Admin/ManageProducts";
import ManageOrders from "./pages/Admin/ManageOrders";
import ManageUsers from "./pages/Admin/ManageUsers";
import SalesOverview from "./pages/Admin/Overview";
import ProfileRoute from "./routes/ProfileRoute";
import Success from "./pages/success.tsx";
import Cancel from "./pages/Cancel.tsx";

const App = () => {
      return (
            <>
                  <Header />
                  <div>
                        <Routes>
                              <Route path="/auth/profile" element={<ProfileRoute />} >
                                    <Route index element={<Profile />} />
                              </Route>
                              <Route path="/admin/dashboard/" element={<PrivateRoute role="admin" />} >
                                    <Route element={<Dashboard />} >
                                          <Route index element={<SalesOverview />} />
                                          <Route path="products" element={<ManageProducts />} />
                                          <Route path="orders" element={<ManageOrders />} />
                                          <Route path="users" element={<ManageUsers />} />
                                    </Route>
                              </Route>
                              <Route index path="/" element={<ProductsList />} />
                              <Route path="/products/:id/detail" element={<ProductDetails />} /> 
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/cart/checkout" element={<CheckOut />} />
                              <Route path="/auth/login" element={<Login />} />
                              <Route path="/auth/register" element={<Register />} />
                              <Route path="/success" element={<Success />} />
                              <Route path="cancel" element={<Cancel />} />
                              <Route path="*" element={<p>There's NOTHING here! 404.</p>} />
                        </Routes>
                  </div>
            </>
      )
}

export default App;