import express, { Request, Response } from "express";
import { createPost, deletePost, getPostById, getPosts, signup, updatePost } from "./database";

import { TPost, TPostRequest, TSignUpRequest } from "./types";
import cors from "cors";

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", function (req, res) {
  res.send("hello world");
});

app.get("/posts", async function (req, res) {
    try {

        let posts = await getPosts()
        res.status(200).send(posts)
    } catch (error) {
        let erro = error as Error
        console.log(error)
        res.status(500).send(erro.message)
    }
  });

  app.post("/posts", async function(req: Request, res: Response) {
    
    try {
        // creator_id deve vir do usuário logado????
        const { content, creator_id } = req.body as TPostRequest

        let errors  =await  validaRequest("", content);
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

  });

  app.put("/posts/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id
        const newContent = req.body.content as string

        let errors  =await  validaRequest(id, newContent);
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

})
 
  app.delete("/posts/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        let post = await getPostById(id)
        if(!post) {
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
})



async function validaRequest(id: string, content: string): Promise<string[]> {

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



// signup

app.post("/users/signup", async (req: Request, res: Response) => {

        try {
            const input: TSignUpRequest = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
            
            const output = await signup(input)
    
            res.status(201).send(output)
        } catch (error) {
            console.log(error)
    
            if (req.statusCode === 200) {
                res.status(500)
            }
    
            if (error instanceof Error) {
                res.send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
)





app.listen(3000);
