import express from "express"
import { PostBusiness } from "../business/PostBusiness"
import { PostController } from "../controller/PostController"
import { IdGenerator } from "../services/IdGenerator"

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new IdGenerator()
    ),
)

postRouter.get("", postController.get)
postRouter.post("", postController.post)
postRouter.delete("/:id", postController.delete)
postRouter.put("/:id", postController.put)
postRouter.put("/:id/like", postController.like)