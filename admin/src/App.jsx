import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Add from "./pages/Add"
import List from "./pages/List"
import Orders from "./pages/Orders"
import Login from "./pages/Login"
import { ToastContainer } from 'react-toastify'
import axios from 'axios';

import Analytics from './pages/Analytics';

import { Routes, Route } from "react-router-dom"

export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const currency = '$';

// Set globally ONCE at module load — ensures ALL axios requests include cookies
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading ,setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${backendURL}/api/user/verifyAdmin`);

        if (response.data.success) {
          setUser(response.data.admin); // verifyAdmin returns 'admin', not 'user'
        }
      } catch (error) {
        console.log("User not authenticated on page load.");
        setUser(null);
      }finally{
        setLoading(false);
      }
    }
    checkLoginStatus();
  }, [])

  
  // Show a loading indicator while checking the session
  if (loading) {
    return <div>Loading...</div>; // Or a more stylish spinner component
  }

  return (
    <>
      <ToastContainer />
      {user === null ?
        <Login setUser={setUser} />
        :
        <div className="">
          <Navbar setUser={setUser}/>
          <div className="bg-gray-300 h-px w-full "></div>
          <div className="flex ">
            <Sidebar />
            <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/add" element={<Add />}></Route>
                <Route path="/list" element={<List currency={currency}/>}></Route>
                <Route path="/orders" element={<Orders />}></Route>

                {/*Analytics Route */}
                <Route path='/analytics' element={<Analytics />} />
              </Routes>
            </div>
          </div>
        </div>}
    </>
  )
}

export default App
