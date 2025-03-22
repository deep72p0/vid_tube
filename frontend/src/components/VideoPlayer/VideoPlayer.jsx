import { useRef } from "react";
import videojs from "video.js";
import Video from "../Video/Video.jsx";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { setPlayingVideo } from "./videoSlice.js";

const VideoPlayer = () => {

    //const dispatch = useDispatch();
    const { playingVideo } = useOutletContext(); // extracting the object from context instead of props
    console.log(playingVideo);
    // const storedVideo = useSelector((state) => state.video.playingVideo);
    const playerRef = useRef(null);
    
    const { title, videoFile } = playingVideo;

    const videoPlayerOptions = {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: videoFile,
                type: "video/mp4",
            },
        ],
    };
    const handlePlayerReady = (player) => {
        playerRef.current = player;
        

        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });
    };
    return (
        <>
            <div>
                <h1>{title}</h1>
            </div>
            <Video 
                options={videoPlayerOptions} 
                onReady={handlePlayerReady} 
            />
        </>
    );
};

export default VideoPlayer;