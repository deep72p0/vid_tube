import mongoose, { isValidObjectId, trusted} from "mongoose";
import {Tweet} from "../models/tweet.model.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    // TODO: create tweet

    // Get the body
    const {content} = req.body;

    //Get the userId
    const {userId} = req.user._id;
     
    // Validation
    if(!content || typeof content !== "string"){
        throw new ApiError(400, "Please fill the Content")
    }
 
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid User")
    }

    // Creating Tweet
    try { 
        const tweet = await Tweet.create({
            content,
            owner: userId
        })
 
        // Response 
        return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"))
    } catch (error) {
        throw new ApiError(404, "Tweet creation failed",error)
    }
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    // Get the userId
     const {userId} = req.user._id;

    // validate the id
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user_id")
    }

    //Get the Tweets
     const userTweets = {};
     
    if(userId){
        userTweets.owner = userId;
    }

    const tweets = await Tweet.find(userTweets);

    if(!userTweets){
        throw new ApiError(400, "Failed to fetch Tweets")
    }

    // Response
    return res
    .status(201)
    .json(new ApiResponse(201, tweets, "Fetched all the tweets successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    // Get the id of the Tweet
    const{tweetId} = req.params;
    // Get the content 
    const {content} = req.body;

    // validation
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet id is not valid")
    }

    if(!content || typeof content !== "string"){
        throw new ApiError(400, "Please fill the Content")
    }
    
    // Update the Tweet
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set:{
                content: content
            }
        }
    );

    if(!updatedTweet){
        throw new ApiError(400, "Failed to update the tweet")
    }

    // Response
    return res
    .status(201)
    .json(new ApiResponse(201, updatedTweet, "Updated the Tweet successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    // Get the id of the Tweet
    const{tweetId} = req.params;

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Tweet id is not valid")
    }
    
    // Update the Tweet
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    if(!deletedTweet){
        throw new ApiError(400, "Failed to update the tweet")
    }

    // Response
    return res
     .status(201)
     .json(new ApiResponse(201, deletedTweet, "Deleted the Tweet successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
