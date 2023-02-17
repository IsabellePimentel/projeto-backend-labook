import express, { Request, Response } from "express";
import { addDislike, addLike, createPost, deletePost, getPostById, getPosts, getUserByEmail, getUserById, login, signup, updatePost } from "./database";

import { TLoginRequest, TPost, TPostRequest, TSignUpRequest } from "./types";
import cors from "cors";
import { TokenManager } from "./services/TokenManager";
import { userRouter } from "./router/userRouter";
import { postRouter } from "./router/postRouter";

const app = express()
app.use(express.json())
app.use(cors())

export async function validaRequest(id: string, content: string): Promise<string[]> {

    let errors: string[] = []

    if (content === null || content === "") {
        errors.push("Content não pode ser nulo/vazio.")
    }

    if(id !== null && id !== "") {
        let postExist = await getPostById(id)
        if (!postExist) {
            errors.push("Post não existe")
        }
    }

    return errors
}



app.use("/posts", postRouter)
app.use("/users", userRouter)
app.listen(3000);
