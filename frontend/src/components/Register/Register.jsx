import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: ""
    })
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const onRegister = async () => {
        
        try {
            setLoading(true);
            const response = await axios.post("/api/v1/users/register", formData);
            console.log("Registered the user successfully", response.data);  
            
        } catch (error) {
            console.error("Failed to register the user", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(formData.email.length > 0 && formData.password.length > 0 && formData.username.length > 0){
            setButtonDisabled(false);
        }
    }, [formData]);
    
    return (
        <div>
            <h1> This is Register </h1>
        </div>
    )
}

export default Register;