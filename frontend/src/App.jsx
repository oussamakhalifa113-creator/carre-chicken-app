import { Routes, Route, Navigate } from "react-router-dom";
import ShapeGrid from "./components/ShapeGrid";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedAdmin({ children }) {
  const isAdmin = localStorage.getItem("admin-auth") === "true";
  return isAdmin ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <ShapeGrid />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/employee"
          element={
            <ProtectedAdmin>
              <EmployeeDashboard />
            </ProtectedAdmin>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdmin>
              <AdminDashboard />
            </ProtectedAdmin>
          }
        />
      </Routes>
    </>
  );
}

export default App;