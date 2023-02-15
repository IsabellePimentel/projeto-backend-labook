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

export type TSignUpRequest = {
    name: string;
    email: string;
    password: string;
}

export type TUser = {
     id: string;
     name: string;
     email: string;
     password: string;
     role: string;
     createdAt: string;
}

export type TTokenPayload = {
    id: string;
    name: string;
    role: string;
}

export type TSignupOutput = {
    mensagem: string;
    token: string;

}