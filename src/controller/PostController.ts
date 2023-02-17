import { Request, Response } from "express"
import { validaRequest } from ".."
import { addDislike, addLike, createPost, deletePost, getPostById, getPosts, getUserById, updatePost } from "../database"
import { TokenManager } from "../services/TokenManager"
import { TPostRequest } from "../types"

export class PostController {
    constructor(
    ) { }

    public get = async function (req: Request, res: Response) {
        try {

            const token = req.header('authorization')

            if (token === undefined) {
                throw new Error("Token undefined")
            }

            let t = token.substring(7, token.length)

            const payload = new TokenManager().getPayload(t)

            if (payload === null) {
                throw new Error("token inválido")
            }

            let posts = await getPosts()
            res.status(200).send(posts)
        } catch (error) {
            let erro = error as Error
            console.log(error)
            res.status(500).send(erro.message)
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const token = req.header('authorization')

            if (token === undefined) {
                throw new Error("Token undefined")
            }

            let t = token.substring(7, token.length)

            const payload = new TokenManager().getPayload(t)

            if (payload === null) {
                throw new Error("token inválido")
            }

            const id = req.params.id

            let post = await getPostById(id)
            if (!post) {
                let msg = "Post não existe"
                console.log(msg)
                res.status(400).send(msg)
            } else {
                await deletePost(id)
                res.status(200).send()
            }

        } catch (error) {
            let erro = error as Error
            console.log(error)
            res.status(500).send(erro.message)
        }
    }

    public post = async function (req: Request, res: Response) {

        try {

            const token = req.header('authorization')

            if (token === undefined) {
                throw new Error("Token undefined")
            }

            let t = token.substring(7, token.length)

            const payload = new TokenManager().getPayload(t)

            if (payload === null) {
                throw new Error("token inválido")
            }

            const { content, creator_id } = req.body as TPostRequest

            let errors = await validaRequest("", content);
            if (errors?.length > 0) {
                console.log(errors)
                res.status(400).send(errors)
            } else {
                let newPostId = await createPost(content, creator_id)
                res.status(201).send(`Post ${newPostId} criado com sucesso!`)
            }

        } catch (error) {
            let erro = error as Error
            console.log(error)
            res.status(500).send(erro.message)
        }
    }

    public put = async (req: Request, res: Response) => {

        try {
            const token = req.header('authorization')

            if (token === undefined) {
                throw new Error("Token undefined")
            }

            let t = token.substring(7, token.length)

            const payload = new TokenManager().getPayload(t)

            if (payload === null) {
                throw new Error("token inválido")
            }

            const id = req.params.id
            const newContent = req.body.content as string

            let errors = await validaRequest(id, newContent);
            if (errors?.length > 0) {
                console.log(errors)
                res.status(400).send(errors)
            } else {
                await updatePost(id, newContent)

                res.status(200).send("Post atualizado com sucesso!")
            }

        } catch (error) {
            let erro = error as Error
            console.log(error)
            res.status(500).send(erro.message)
        }
    }

    public like = async (req: Request, res: Response) => {

        try {
            const token = req.header('authorization')

            if (token === undefined) {
                throw new Error("Token undefined")
            }

            let t = token.substring(7, token.length)

            const payload = new TokenManager().getPayload(t)

            if (payload === null) {
                throw new Error("token inválido")
            }

            const id = req.params.id
            const like = req.body.like as boolean

            const user = await getUserById(payload.id)
            const post = await getPostById(id)

            if (post.creator_id === user.id) {
                throw new Error('Quem criou o post não pode dar like ou dislike no mesmo.')
            } else {

                if (like) {
                    post.likes = post.likes + 1;
                    addLike(post.id, post.likes)
                } else {
                    post.dislikes = post.dislikes + 1;
                    addDislike(post.id, post.dislikes)
                }

                res.status(200).send("Requisição realizada com sucesso!")
            }

        } catch (error) {
            let erro = error as Error
            console.log(error)
            res.status(500).send(erro.message)
        }

    }

}
