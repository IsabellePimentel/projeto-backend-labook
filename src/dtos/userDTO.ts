export interface LoginInputDTO {
    email: string,
    password: string
}

export interface LoginOutputDTO {
    token: string,
    mensagem: string
}

export interface SignupInputDTO {
    name: string,
    email: string,
    password: string
}

export interface SignupOutputDTO {
    token: string,
    mensagem: string
}
