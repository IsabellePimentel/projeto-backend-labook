import { db } from "./database/knex";
import { TPost, TSignupOutput, TSignUpRequest,TTokenPayload,TUser } from "./types";
import { v1, v4 as uuidv4 } from 'uuid';
import { TokenManager } from "./TokenManager";

export const getPosts = async (): Promise<TPost[]>=> {
    const posts = await db.raw(`SELECT * FROM posts;`)
    return posts
}

export const createPost = async (content: string, creatorId: string): Promise<string> => {
    let id = uuidv4();
    let zero = 0

    await db.raw(`
            INSERT INTO posts(id, content, creator_id, likes, dislikes, updated_at)
            VALUES("${id}", "${content}", "${creatorId}", "${zero}", "${zero}", DATETIME());
        `)

    return id
}

export const deletePost = async (id: string): Promise<void> => {
    await db.raw(`DELETE FROM posts WHERE id = "${id}";`)
}

export const updatePost = async (id: string, newContent: string): Promise<void> => {
    await db.raw(`UPDATE posts SET content="${newContent}" WHERE id = "${id}";`)
}

export const getPostById = async (id: string) : Promise<TPost> =>{

    const posts = await db.raw(`SELECT * FROM posts WHERE id = "${id}";`)
    return posts?.[0]

}

export const signup = async (input: TSignUpRequest) : Promise<TSignupOutput> =>{

    const { name, email, password } = input


    const id = uuidv4();
    const role = "NORMAL";
    const createdAt = new Date().toISOString()

    const newUser: TUser = {
        id,
        name,
        email,
        password,
        role,
        createdAt
     } 

    await inserirUsuario(newUser)

    const tokenPayload: TTokenPayload = {
        id: id,
        name: name,
        role: role
    }

    const token = new TokenManager().createToken(tokenPayload)

    let mensagem = "Cadastro realizado com sucesso";
    const output: TSignupOutput = {
        mensagem,
        token
    }

    return output
}


export const inserirUsuario = async (newUser: TUser): Promise<string> => {
    let id = uuidv4();
    let zero = 0

    await db.raw(`
    INSERT INTO users (id, name, email, password, role) 
    VALUES("${id}", "${newUser.name}", "${newUser.email}", "${newUser.password}", "${newUser.role}");
        `)

    return id
}