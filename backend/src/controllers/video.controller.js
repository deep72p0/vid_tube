import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {deleteFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import path from "path"
import { exec } from "child_process"
import axios from "axios"

const getAllVideos = asyncHandler(async (req, res) => {

    // Step 1: Extract Query Parameters
    const { page = 1, limit = 10, search, sort, userId } = req.query

    //TODO: get all videos based on query, sort, pagination
     try {
         // Step 2: Validate `page` and `limit`
         if (isNaN(page) || page <= 0) {
              throw new ApiError(400, "Invalid 'page' parameter. It must be a positive number.");
        }
        if (isNaN(limit) || limit <= 0) {
            throw new ApiError(400, "Invalid 'limit' parameter. It must be a positive number.");
        }
    
        // Step 3: Build and Validate Filter Object
        const filter = {};
        if (search) {
            if (typeof search !== "string") {
                  throw new ApiError(400, "Invalid 'search' parameter. It must be a string.");
            }
             filter.title = { $regex: search, $options: "i" }; // Case-insensitive search
         }

        if (userId) {
             if (!isValidObjectId(userId)) {
                   throw new ApiError(400, "User not found");
             }
             filter.owner = userId; // For fetching the videos uploaded of a specific user
        }
    
         // Step 4: Build and Validate Sort Criteria
        const sortCriteria = {};
        if (sort) {
            const [field, order] = sort.split(":")
                if (!field || !["asc", "desc"].includes(order)) {
                  throw new ApiError(400, "Invalid 'sort' parameter. Use 'field:asc' or 'field:desc'.");
               }
               sortCriteria[field] = order === "desc" ? -1 : 1;
         }
    
        // Step 5: Pagination Calculations
        const skip = (page - 1) * limit;
    
        // Step 6: Query Database
         const videos = await Video.find(filter)
            .populate("owner", "username email") 
            .sort(sortCriteria)
            .skip(skip)
            .limit(parseInt(limit));
    
        // Validate if videos are found
         if (!videos || videos.length === 0) {
              throw new ApiError(404, "No videos found for the given query.");
         }
    
        // Step 7: Get Total Count
        const totalVideos = await Video.countDocuments(filter);
    
         // Step 8: Respond with Data
         return res
        .status(201)
        .json({
            ...new ApiResponse(201, videos, "Video fetched successfully"),
            pagination: {
                total: totalVideos,
                page: parseInt(page, 10),
                limit: parseInt(limit, 10),
                totalPages: Math.ceil(totalVideos / limit)
            }
        });

    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    }
});

// function to get the duration of a video
const getVideoDuration = (videoPath) =>  {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                reject(err);
                return;
            }

            const duration = metadata.format.duration;
            const seconds = duration % 60;

            return resolve({
                durationInSeconds: seconds,
                metadata
            });
        });
    })
}

// download the video to local directory from cloudinary
const downloadFile = async (url, outputPath) => {
    const writer = fs.createWriteStream(outputPath);
    const response = await axios ({
        url,
        method: "GET",
        responseType: "stream",
    })

    response.data.pipe(writer);

    return new Promise ((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    })
}

//function to convert a video from mp4 to hls(m3u8)
const convertToHls = async (videoUrl, Id) => {
    const outputPath =  path.resolve(process.cwd(), `./public/temp/${ Id }`); // __dirname would not work here

    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(
            outputPath,
            { recursive: true }
        )
    }
 
    const localVideoPath = path.join(outputPath, "input.mp4");
    await downloadFile(videoUrl, localVideoPath);

    const hlsPath =  path.join(outputPath, `index.m3u8`);
    console.log("hlsPath", hlsPath)

    return new Promise((resolve, reject) => {
        // ffmpeg
        const ffmpegCommand = `ffmpeg -i ${localVideoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;
            
        // no queue because of POC, not to be used in production
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if(error) {
            console.log(`exec error: ${error}`)
            reject(error);
            return;
            }
            console.log(`stdout: ${stdout}`)
            console.log(`stderr:${stderr}`)
            const videoUrl = `http://localhost:8000/public/temp/${Id}/index.m3u8`;

            return resolve({
                message: "Video converted to HLS format",
                videoUrl: videoUrl,
                Id: Id 
            })
        })
    })
}

const publishAVideo = asyncHandler(async (req, res) => {

    // TODO: get video, upload to cloudinary, create video
    const { title, description } = req.body
    
    // Get the User ID automatically from the token
    const userId = req.user?._id

    // Validation
     if(!title || typeof title !== "string"){
        throw new ApiError (400, "Title needs to be a string")
    }
     
    if(!description || typeof description !== "string"){
        throw new ApiError (400, "Description needs to be a string")
    }

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "User is not Valid")
    }

    // Get the Filepath
    const videoFilePath = req.files?.videoFile[0].path

    if(!videoFilePath){
        console.log(`hello from:`, req.files)
        throw new ApiError (400, "Video file is missing") 
    }

    const thumbnailPath = req.files?.thumbnail[0].path

    if(!thumbnailPath){
        
        throw new ApiError (400, "Thumbnail is missing") 
    }

    const durationObject = await getVideoDuration(videoFilePath);

    // Upload it on the Cloudinary
    const videoFile = await uploadOnCloudinary(videoFilePath);

    if(!videoFile.url){
        throw new ApiError(400, "Failed to upload on Cloudinary")
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if(!thumbnail.url){
        throw new ApiError(400, "Failed to upload on Cloudinary")
    }

    try{
        // Create the Video
        console.log(videoFilePath);

        console.log("VIDEO DURATION: ", durationObject);

        const video = await Video.create({
            title,
            description,
            videoFile: videoFile.url,
            thumbnail: thumbnail.url,
            duration: durationObject.durationInSeconds,
            owner: userId
        })

        // Save the video?(in the updated versions *.Create* method creates an saves the object into the DB automatically)
        //await video.save({ validateBeforeSave: false })

        // Return a response

        // convert the video to hsl format
        const hlsResult = await convertToHls(videoFile.url, video._id);

        if(!hlsResult){
            console.log(`hello from:`, req.files)
            throw new ApiError (400, "Hls file is missing") 
        }
     
        return res
        .status(201)
        .json(new ApiResponse(201, { video, hls: hlsResult }, "Published the video"))
    } catch(error){
        console.error(error)
        throw new ApiError(500,"Something happened while uploading the video")
    }
})

const getVideoById = asyncHandler(async (req, res) => {

    // TODO: get video by id
    const { videoId } = req.params;

    if(!videoId){
        console.log(videoId);
        throw new ApiError(400, "did not receive any video_id")
    }

    const video = await Video.findById(videoId).populate("owner", "username email");

    if(!video){
        throw new ApiError(400, "video not found")
    }

    // Returning a response
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    
    // Get video details
    const {title, description} = req.body

    if(!title || typeof title !== "string"){
        throw new ApiError (400, "Title needs to be a string")
    }
     
    if(!description || typeof description !== "string"){
        throw new ApiError (400, "Description needs to be a string")
    }
    
    // Get the thumbnail
     const thumbnailFilePath = req.file?.path
    
     if(!thumbnailFilePath){
        throw new ApiError(400, "Filepath not found")
    }
    
    const thumbnail = await uploadOnCloudinary(thumbnailFilePath)
    if(!thumbnail.url){
        throw new ApiError(400, "Thumbnail does not exist")
    }

    //Delete the old thumbnail
    const video = await Video.findById(req.params.videoId)

    if(video.thumbnail){
        await deleteFromCloudinary(thumbnail.public_id)
    }

    // Update the video
    const { videoId } = req.params
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,                                       // req.params?._id can also b used
        {
            $set:{
                title,                
                description,
                thumbnail: thumbnail.url
            }
        },
        {new: true, runValidators:true}                 // Return the updated document and run schema validators
    )

    // Returning a response
    return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video details updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {

    // TODO: delete video
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid id")
    }

    // Find and delete the Video
    const video = await Video.findByIdAndDelete(videoId)
    
    if(video){                             
   // We have to fetch the publicId because the video is already deleted from the DB(i guess /\(*~*)/\)
        await deleteFromCloudinary(video.public_id);
    }

    // Response
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {

    // Validate the video ID
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid id")
    }

    try {
        // Find the video by ID
        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        // Toggle the published status
        video.isPublished = !video.isPublished;
        const updatedVideo = await video.save();

        // Send the updated video as a response
        return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video publish status updated successfully"))
    } catch (error) {
        throw new ApiError(500, error.message || "Server error");
    }
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
