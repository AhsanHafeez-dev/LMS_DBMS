import express from "express";
import { addlikeToLecture } from "../../controllers/comment-like-controllers/video.controller";
import { addlikeToComment } from "../../controllers/comment-like-controllers/comment.controller";


const likeRouter = express.Router()

// lecture like routes
likeRouter.route("/lectures/:lectureId/:userId").post(addlikeToLecture);

// comment like routes
likeRouter.route("/:commentId/:userId").post(addlikeToComment);


export { likeRouter }