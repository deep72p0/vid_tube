import axios from "axios";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";

function Layout() {
    
    // useEffect(async () => {
    //     const response = await axios.get("/api/v1/users/current-user")
    //     if("username, email is not in the database send them to regiser || send them to login"){
            
    //     }
    // })
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default Layout;