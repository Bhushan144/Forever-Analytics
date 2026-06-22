import React, { useState } from 'react'
import axios from 'axios'
import { backendURL } from '../App';
import { toast } from 'react-toastify';


const Login = ({ setUser }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault(); //stops the page from reloading when submit button is clicked
        if (!email || !password) {
            return toast.error("Please fill in all fields.");
        }

        try {
            const response = await fetch(`${backendURL}/api/user/loginAdmin`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ "email": email, "password": password })
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                setUser(data.admin)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log("error ", error)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center w-screen h-screen bg-[#f2f3f5]">
                <div className="w-[330px] h-[330px] bg-[#FFFFFF] px-5 rounded-xl">
                    <div className="w-full ">
                        <h1 className='flex items-center justify-center mt-4 text-xl font-bold'>Admin Panel</h1>
                    </div>
                    <form onSubmit={onSubmitHandler} className=''>
                        <div className="w-full mt-5 flex gap-2 flex-col">
                            <p>Email Address</p>
                            <input onChange={(e) => { setEmail(e.target.value) }} value={email} className='border p-2 rounded-lg border-gray-300 focus:outline-none' type="email" placeholder='Enter your email.' />
                        </div>
                        <div className="w-full mt-5 flex gap-2 flex-col">
                            <p>Password</p>
                            <input onChange={(e) => { setPassword(e.target.value) }} value={password} className='border border-gray-300 p-2 rounded-lg focus:outline-none' type="password" placeholder='Enter your password' />
                        </div>
                        <div className="w-full mt-5 mb-5 flex gap-2 flex-col">
                            <button className='rounded-xl text-lg tracking-wider bg-black text-white py-2'>login</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
