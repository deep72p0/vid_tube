import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";

function Layout({ playingVideo, setPlayingVideo }) {

    console.log(playingVideo);
    
    // Load video from localStorage on mount

    // Save the video to localStorage whenver it changes (so when reloading the video will load from localStorage even if the context dissapears)
    // useEffect(() => {
    //     if (playingVideo) {
    //         localStorage.setItem("video", JSON.stringify(playingVideo));
    //     }
    // })

    // useEffect(() => {    
    //     window.onpopstate = () => {
    //         window.location.reload();
    //     };
    //  }, []);
    // useEffect(async () => {
    //     const response = await axios.get("/api/v1/users/current-user")
    //     if("username, email is not in the database send them to regiser || send them to login"){
            
    //     }
    // })
    return (
        <>
            <Header />
            <Outlet context = {{playingVideo, setPlayingVideo}}/> {/* passing the states through context */} 
        </>
    )
}

export default Layout;