import React from "react";
import { useState, useEffect } from "react";

function Channel() {

    const [data, setData] = useState([])

    useEffect(() => {
        fetch("http://localhost:8000/api/v1/dashboard/stats")
        .then((response) => response.json())
        .then(data => {
            console.log(data)
            setData(data)
        })
    }, [])

    useEffect(() => {
        fetch("http://localhost:8000/api/v1/dashboard/videos")
        .then((response) => response.json())
        .then(data => {
            console.log(data)
            setData(data)
        })
    }, [])

    return (
        <div> 
            <p>hey</p>
        </div>       
    )
}

export default Channel;