export type TPost = {
    id: string;
    creator_id: string;
    content: string;
    likes: number;
    dislikes: number;
    created_at: string;
    updated_at: string;
}

export type TPostRequest = {
    content: string;
    creator_id: string;
}