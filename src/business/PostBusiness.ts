import { db } from "../database/knex";
import { IdGenerator } from "../services/IdGenerator";
import { TPost, TUser } from "../types";

const bcrypt = require("bcrypt");

export class PostBusiness {
    constructor(
        private idGenerator: IdGenerator
    ) { }


    public getPosts = async (): Promise<TPost[]> => {
        const posts = await db.raw(`SELECT * FROM posts;`)
        return posts
    }

    public createPost = async (content: string, creatorId: string): Promise<string> => {
        let id = this.idGenerator.generate();
        let zero = 0

        await db.raw(`
                INSERT INTO posts(id, content, creator_id, likes, dislikes, updated_at)
                VALUES("${id}", "${content}", "${creatorId}", "${zero}", "${zero}", DATETIME());
            `)

        return id
    }

    public deletePost = async (id: string): Promise<void> => {
        await db.raw(`DELETE FROM posts WHERE id = "${id}";`)
    }

    public updatePost = async (id: string, newContent: string): Promise<void> => {
        await db.raw(`UPDATE posts SET content="${newContent}" WHERE id = "${id}";`)
    }

    public getPostById = async (id: string): Promise<TPost> => {

        const posts = await db.raw(`SELECT * FROM posts WHERE id = "${id}";`)
        return posts?.[0]

    }

    public getUserById = async (id: string): Promise<TUser> => {

        const users = await db.raw(`SELECT * FROM users WHERE id = "${id}";`)
        return users?.[0]

    }

    public addLike = async (id: string, likes: number): Promise<void> => {
        await db.raw(`UPDATE posts SET likes=${likes} WHERE id = "${id}";`)
    }

    public addDislike = async (id: string, dislikes: number): Promise<void> => {
        await db.raw(`UPDATE posts SET dislikes=${dislikes} WHERE id = "${id}";`)
    }
}