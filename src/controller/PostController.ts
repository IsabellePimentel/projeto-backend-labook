import { Request, Response } from "express"
import { TokenManager } from "../services/TokenManager"
import { PostBusiness } from "../business/PostBusiness"
import { PostRequestDTO } from "../dtos/postDTO"

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) { }

    public get = async  (req: Request, res: Response) => {
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

            let posts = await this.postBusiness.getPosts()
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

            let post = await this.postBusiness.getPostById(id)
            if (!post) {
                let msg = "Post não existe"
                console.log(msg)
                res.status(400).send(msg)
            } else {
                await this.postBusiness.deletePost(id)
                res.status(200).send()
            }

        } catch (error) {
            let erro = error as Error
            console.log(error)
            res.status(500).send(erro.message)
        }
    }

    public post = async  (req: Request, res: Response) => {

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

            const { content, creator_id } = req.body as PostRequestDTO

            let errors = await this.validaRequest("", content);
            if (errors?.length > 0) {
                console.log(errors)
                res.status(400).send(errors)
            } else {
                let newPostId = await this.postBusiness.createPost(content, creator_id)
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

            let errors = await this.validaRequest(id, newContent);
            if (errors?.length > 0) {
                console.log(errors)
                res.status(400).send(errors)
            } else {
                await this.postBusiness.updatePost(id, newContent)

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

            const user = await this.postBusiness.getUserById(payload.id)
            const post = await this.postBusiness.getPostById(id)

            if (post.creator_id === user.getId()) {
                throw new Error('Quem criou o post não pode dar like ou dislike no mesmo.')
            } else {

                if (like) {
                    post.likes = post.likes + 1;
                    this.postBusiness.addLike(post.id, post.likes)
                } else {
                    post.dislikes = post.dislikes + 1;
                    this.postBusiness.addDislike(post.id, post.dislikes)
                }

                res.status(200).send("Requisição realizada com sucesso!")
            }

        } catch (error) {
            let erro = error as Error
            console.log(error)
            res.status(500).send(erro.message)
        }

    }


    public validaRequest = async  (id: string, content: string): Promise<string[]> => {

        let errors: string[] = []
    
        if (content === null || content === "") {
            errors.push("Content não pode ser nulo/vazio.")
        }
    
        if(id !== null && id !== "") {
            let postExist = await this.postBusiness.getPostById(id)
            if (!postExist) {
                errors.push("Post não existe")
            }
        }
    
        return errors
    }

}
