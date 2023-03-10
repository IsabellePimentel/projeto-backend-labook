import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/UserController"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const userRouter = express.Router()

const userController = new UserController(
    new UserBusiness(
        new TokenManager(),
        new IdGenerator()
    )
)

userRouter.post("/login", userController.login)
userRouter.post("/signup", userController.signup)