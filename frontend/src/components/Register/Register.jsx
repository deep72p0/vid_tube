import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        fullname: "",
        email: "",
        password: "",
        avatar: null,
        coverImage: null
    })
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    
    const handleFileChange = (event, type) => {

        const file = event.target.files[0];

        if(file) {
            if(type === "avatar") {
                setAvatarPreview(URL.createObjectURL(file));
            } else {
                setCoverPreview(URL.createObjectURL(file));
            }
        }

        setFormData(prev => ({ ...prev, [type]: file}))
    }

    const onRegister = async (event) => {

        event.preventDefault();

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8000/api/v1/users/register", formData);
            console.log("Registered the user successfully", response.data); 
            navigate(`/login`);
        } catch (error) {
            console.error("Failed to register the user", error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(formData.email.length > 0 || formData.password.length > 0 || formData.username.length > 0){
            setButtonDisabled(false);
        }
    }, [formData]);
    
    return (
        <div className = "flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className = "text-2xl pb-8">{loading ? "Processing" : "Register"}</h1>
            <fieldset>
                <form 
                    className = "flex flex-col justify-center items-center"
                    onSubmit = {onRegister}
                >
                    <div className = "flex flex-col items-center justify-center">
                        <label htmlFor = "username">username</label>
                        <input 
                            className = "p-2 border border-gray-300 rounded-lg m-2 focus:outline-none focus:border-gray-600 text-black"
                            id = "username"
                            type = "text"
                            value = {formData.username}
                            onChange = {(e) => setFormData({...formData, username: e.target.value})}
                            placeholder = "username"
                        />
                    </div>

                    <div className = "flex flex-col items-center justify-center">
                        <label htmlFor = "fullname">fullname</label>
                        <input
                            className = "p-2 border border-gray-300 rounded-lg m-2 focus:outline-none focus:border-gray-600 text-black"
                            id = "fullname"
                            type = "text"
                            value = {formData.fullname}
                            onChange = {(e) => setFormData({...formData, fullname: e.target.value})}
                            placeholder = "fullname"
                        />
                    </div>

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
                    <div className="flex flex-col items-center justify-center">
                        <label htmlFor = "avatar"></label>
                        <input
                            type = "file"
                            id = "avatar"
                            accept = "image/*"
                            onChange = {(e) => handleFileChange(e, "avatar")}
                            className = "m-2"
                        />
                        {avatarPreview && (
                            <img src = {avatarPreview} alt = "Avatar Preview" className ="w-24 h-24 rounded-full object-cover mt-2" />
                        )}
                    </div>
                    <button 
                        type = "submit"
                        className = " w-2/4 h-10 border border-gray-300 rounded-lg m-2 focus:outline-none focus:border-gray-600"
                        disabled = {!formData.email.length || !formData.fullname.length || !formData.password.length}
                    >
                        {buttonDisabled ? "No register" : "Register"}
                    </button>
                </form>  
            </fieldset>
            <div className = "m-4"><Link to = "/login">Visit login page</Link></div>
        </div>
    )
}

export default Register;