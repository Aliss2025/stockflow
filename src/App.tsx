import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Invoices from "./pages/Invoices"
import Accounting from "./pages/Accounting"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/accounting" element={<Accounting />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
