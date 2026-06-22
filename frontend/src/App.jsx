import { Route,Routes } from "react-router-dom"
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {

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
