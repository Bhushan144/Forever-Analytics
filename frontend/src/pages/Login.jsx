import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ ADD THIS LINE
import { toast } from 'react-toastify'; // ✅ ADD THIS LINE

const Login = () => {
    const { backendURL, setUser } = useContext(ShopContext);
    const navigate = useNavigate();

    const [currentState, setCurrentState] = useState('Login');
    const [data, setData] = useState({ name: "", email: "", password: "" });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        axios.defaults.withCredentials = true;

        let url = currentState === "Login"
            ? `${backendURL}/api/user/login`
            : `${backendURL}/api/user/register`;

        try {
            const response = await axios.post(url, data);
            if (response.data.success) {
                setUser(response.data.user);
                toast.success(response.data.message);
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <form onSubmit={submitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
                <p className="prata-regular text-3xl">{currentState}</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {currentState === 'Login' ? null : <input type="text" name='name' onChange={onChangeHandler} value={data.name} className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />}
            <input type="email" name='email' onChange={onChangeHandler} value={data.email} className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
            <input type="password" name='password' onChange={onChangeHandler} value={data.password} className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
            <div className="w-full flex justify-between text-sm mt-[ -8px]">
                <p className="cursor-pointer">Forgot your password?</p>
                {currentState === 'Login'
                    ? <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">Create account</p>
                    : <p onClick={() => setCurrentState('Login')} className="cursor-pointer">Login Here</p>
                }
            </div>
            <button type='submit' className="bg-black text-white font-light px-8 py-2 mt-4">{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
        </form>
    );
};

export default Login;