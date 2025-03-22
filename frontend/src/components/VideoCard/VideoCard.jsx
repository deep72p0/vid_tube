import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setPlayingVideo } from "../VideoPlayer/videoSlice";

function VideoCard({ video, setPlayingVideo, currentPlayingVideo }) {

    const navigate = useNavigate();
    // const dispatch = useDispatch();

    const handleClick = (playingVideo) => {
        setPlayingVideo(playingVideo);
    }

    const { _id, thumbnail, title, owner, createdAt } = video

    useEffect(() => {
        navigate(`/video/${_id}`)
    }, [currentPlayingVideo]);

    return (
        <div
            className="videocard"
            key={_id}
            onClick={() => handleClick(video)}
        >
            <div className="m-8">
                <img src={thumbnail} alt="Thumbnail" className="w-24 h-24 rounded-2xl object-cover mt-2" />
            </div>
            <div className="h-16 mt-8 flex flex-col justify-between">
                <h5 className="text-xl">{title}</h5>
                <p>{owner.username},  {createdAt}</p>
            </div>
        </div>
    )
}

export default VideoCard;