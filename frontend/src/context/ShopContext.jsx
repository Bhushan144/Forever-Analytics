import { createContext, useEffect, useState } from "react";
// import {products} from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    let currency = "$";
    let delivery_fee = 10;
    let backendURL = import.meta.env.VITE_BACKEND_URL;
    let shippingFee = 10;

    let [products, setProducts] = useState([]);

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    let [search, setSearch] = useState('');
    let [showSearch, setShowSearch] = useState(false);

    let [cartItem, setCartItem] = useState({});
    const navigate = useNavigate();

    // In addToCart
    let addToCart = (itemId, size) => { // Removed async
        if (size === "") {
            toast.error("Select Product Size");
            return;
        }
        setCartItem(prevCart => {
            const newCart = structuredClone(prevCart);
            if (newCart[itemId]) {
                if (newCart[itemId][size]) {
                    newCart[itemId][size]++;
                } else {
                    newCart[itemId][size] = 1;
                }
            } else {
                newCart[itemId] = { [size]: 1 };
            }
            return newCart;
        });
    }

    let getCartCount = () => {
        let totalCount = 0;
        for (let items in cartItem) {
            for (let item in cartItem[items]) {
                try {
                    if (cartItem[items][item] > 0) {
                        totalCount = totalCount + cartItem[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount;
    }

    // In updateQuantity
    let updateQuantity = (itemId, size, quantity) => { // Removed async
        setCartItem(prevCart => {
            const newCart = structuredClone(prevCart);
            if (newCart[itemId] && newCart[itemId][size] !== undefined) {
                newCart[itemId][size] = quantity;
            }
            return newCart;
        });
    }

    let getCartAmount = () => {
        let totalAmount = 0;
        for (let items in cartItem) {
            // Find the product info from the state
            let itemInfo = products.find((product) => product._id === items);

            // CRITICAL FIX: Check if the product exists before using it
            if (!itemInfo) {
                console.error(`Product with ID ${items} not found in products list.`);
                continue; // Skip this item if not found
            }

            for (let item in cartItem[items]) {
                if (cartItem[items][item] > 0) {
                    totalAmount = totalAmount + itemInfo.price * cartItem[items][item];
                }
            }
        }
        return totalAmount;
    }

    let getProductData = async () => {
        try {
            const res = await fetch(`${backendURL}/api/product/list`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Failed to fetch product list:", error);
            toast.error("An error occurred while fetching the list.");
        }
    }

    let checkLoginStatus = async () => {
        try {
            axios.defaults.withCredentials = true; // Ensure cookies are sent
            const response = await axios.get(`${backendURL}/api/user/verifyUser`);
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log("User not authenticated on initial load.");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    let logout = async () => {
        try {
            await axios.post(`${backendURL}/api/user/logout`);
            setUser(null);
            toast.success("Logged out successfully.");
            navigate("/"); // Redirect to home page after logout
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        }
    }

    useEffect(() => {
        getProductData();
        checkLoginStatus();
    }, [])

    let value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addToCart,
        getCartCount,
        updateQuantity,
        shippingFee,
        getCartAmount,
        navigate,
        backendURL,
        setUser,
        user,
        logout,
        loading
    }


    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;