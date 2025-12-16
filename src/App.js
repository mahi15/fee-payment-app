import { HashRouter as Router, Routes, Route } from "react-router-dom";
import FeeForm from "./components/FeeForm";
import PaymentPage from "./components/PaymentPage";
import SuccessPage from "./components/SuccessPage";
import PaymentFailed from "./components/PaymentFailed";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeeForm />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failed" element={<PaymentFailed />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
