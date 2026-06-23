import React, { useEffect } from 'react'
import { Route,Routes,useLocation } from "react-router-dom"
import Home from "./pages/Home"
import Collection from "./pages/Collection"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import PlaceOrder from "./pages/PlaceOrder"
import Orders from "./pages/Orders"
import Navbar from "./components/Navbar"
import Footer from './components/Footer'
import SearchBar from "./components/SearchBar"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';

// --- Analytics Import ---
import { tracker } from './analytics/tracker';

function App() {
  // Hook into React Router to detect URL changes
  const location = useLocation();

  useEffect(() => {
    // Fire a page_view event every time the route changes.
    // Note: The tracker.js automatically grabs the page_url at the root level!
    tracker.track('page_view', {
      page_title: document.title,
      referrer: document.referrer
    });
  }, [location]); // The dependency array ensures this runs on every navigation

  return (
    <div className="px-2 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar/>
      <SearchBar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Collection" element={<Collection/>}/>
        <Route path="/About" element={<About/>}/>
        <Route path="/Contact" element={<Contact/>}/>
        <Route path="/Product/:productId" element={<Product/>}/>
        <Route path="/Cart" element={<Cart/>}/>
        <Route path="/Login" element={<Login/>}/>

        <Route path="/place-order" element={<ProtectedRoute><PlaceOrder/></ProtectedRoute>}/>
        <Route path="/Orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
