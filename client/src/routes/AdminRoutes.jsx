import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../admin/pages/Dashboard";
import AddEditProduct from "../admin/pages/AddEditProduct";
import AddEditCategory from "../modules/categories/admin/AddEditCategory";
import Order from "../admin/pages/Order";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute adminOnly />}>

        <Route path="dashboard" element={<Dashboard />} />

        {/* PRODUCTS */}
        <Route path="products">
          <Route path="add" element={<AddEditProduct />} />
          <Route path="edit/:id" element={<AddEditProduct />} />
        </Route>

        {/* CATEGORIES */}
        <Route path="categories">
          <Route index element={<AddEditCategory />} /> 
          <Route path="add" element={<AddEditCategory />} />
          <Route path="edit/:id" element={<AddEditCategory />} />
        </Route>
        {/* ORDERS */}
        <Route path="orders" element={<Order />} />
      </Route>
    </Routes>
  );
}