import express from "express"
import { PostController } from "../controller/PostController"

export const postRouter = express.Router()

const postController = new PostController()

postRouter.get("", postController.get)
postRouter.post("", postController.post)
postRouter.delete("/:id", postController.delete)
postRouter.put("/:id", postController.put)
postRouter.put("/:id/like", postController.like)