import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import ApparelShop from './pages/ApparelShop.jsx'

export default function AppRoutes() {
  return <BrowserRouter><Routes><Route path="/" element={<App />} /><Route path="/apparel" element={<ApparelShop />} /><Route path="*" element={<App />} /></Routes></BrowserRouter>
}
