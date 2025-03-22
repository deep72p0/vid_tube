import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const onLogin = async (event) => {
        
        event.preventDefault()

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8000/api/v1/users/login", 
                formData,
                {withCredentials: true} // ensures the cookies are sent
            );
            console.log("User has logged in successfully", response.data);  
            //navigate(`/channel`)
        } catch (error) {
            console.error("Failed to log in the user", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(formData.email.length > 0 || formData.password.length > 0){
            setButtonDisabled(false);
        }
    }, [formData]);
    
    return (
        <div className = "flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className = "text-2xl pb-8">{loading ? "Processing" : "Login"}</h1>
            <fieldset>
                <form 
                    onSubmit = {onLogin}
                    className = "flex flex-col justify-center items-center">
                    <div className = "flex flex-col items-center justify-center">
                        <label htmlFor = "email">email</label>
                        <input
                            className = "p-2 border border-gray-300 rounded-lg m-2 focus:outline-none focus:border-gray-600 text-black"
                            id = "email"
                            type = "email"
                            value = {formData.email}
                            onChange = {(e) => setFormData({...formData, email: e.target.value})}
                            placeholder = "email" 
                        />
                    </div>

                    <div className = "flex flex-col items-center justify-center">
                        <label htmlFor = "password">password</label>
                        <input
                            className = "p-2 border border-gray-300 rounded-lg m-2 focus:outline-none focus:border-gray-600 text-black"
                            id = "password"
                            type = "password"
                            value = {formData.password}
                            onChange = {(e) => setFormData({...formData, password: e.target.value})}
                            placeholder = "password"
                        />
                    </div>
                    <button 
                        type = "submit"
                        className = " w-2/6 h-10 border border-gray-300 rounded-lg m-2 focus:outline-none focus:border-gray-600"
                        disabled = {!formData.email.length || !formData.password.length}
                    >
                        {buttonDisabled ? "No login" : "Login"}
                    </button>
                </form>
                <div className = "flex justify-between w-72 m-4"><Link to = "/register">Visit register page</Link> <Link to = "/verifyemail">Forgot Password</Link></div>
            </fieldset>
        </div>
    )
}

export default Login;