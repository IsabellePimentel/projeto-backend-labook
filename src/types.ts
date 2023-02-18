

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

export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}