import { Routes, Route } from "react-router-dom";
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
import StripeSuccess from "./pages/StripeSuccess";
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
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/stripe-success" element={<StripeSuccess />} />
      </Routes>
    </>
  );
}

export default App;
