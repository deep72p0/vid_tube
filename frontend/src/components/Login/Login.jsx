import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const onRegister = async () => {
        
        try {
            setLoading(true);
            const response = await axios.post("/api/v1/users/login", formData);
            console.log("User has logged in successfully", response.data);  
            
        } catch (error) {
            console.error("Failed to log in the user", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(formData.email.length > 0 && formData.password.length > 0){
            setButtonDisabled(false);
        }
    }, [formData]);
    
    return (
        <div>
            <h1> This is Login </h1>
        </div>
    )
}

export default Login;