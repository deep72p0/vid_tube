import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import VideoCard from "../VideoCard/VideoCard";
import { useOutletContext } from "react-router-dom";

function Channel() {

    // const [data, setData] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {playingVideo, setPlayingVideo} = useOutletContext();

    // useEffect(() => {
    //     const fetchData = async() => {
    //         try {
    //             const response = await axios.get("http://localhost:8000/api/v1/dashboard/stats")
    //             const stats = response.data
    //             console.log(stats)
    //             setData(stats)
    //         } catch (err) {
    //             console.error("Error fetching channel stats:", err);
    //             setError("Failed to fetch user data. Please try again.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchData();
    // }, [])

    
    useEffect(() => {
        const fetchVideos = async() => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/videos",
                    {withCredentials: true}
                )
                const videos = response.data.data
                console.log(videos)
                setVideos(videos)
            } catch (err) {
                console.error("Error fetching videos:", err);
                setError("Failed to fetch videos. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [])

    if (loading) return <div>Loading videos...</div>
    if (error) return <div>{error}</div>

    return (
        <div>
            <div className = "flex justify-center items-center">
                <div>Channel Stats</div>
                <div>Channel Stats</div>
            </div>
            <div className = "flex flex-col justify-center items-center">
                <h1 className = "text-2xl pb-10">Watch History</h1>
                <div>
                    {videos.map((video) => {
                        return (
                            <div
                                key = {video._id}
                            >
                                <VideoCard
                                    video = { video }
                                    currentPlayingVideo = {playingVideo}
                                    setPlayingVideo = { setPlayingVideo }
                                />
                            </div>
                        )
                    })}
                </div>    
            </div>    
        </div>
    )
}

export default Channel;