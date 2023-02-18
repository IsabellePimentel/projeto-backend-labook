import { db } from "../database/knex";
import {   TTokenPayload, TUser, USER_ROLES } from "../types";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/IdGenerator";
import { LoginInputDTO, LoginOutputDTO, SignupInputDTO, SignupOutputDTO } from "../dtos/userDTO";
import { User } from "../model/User";

const bcrypt = require("bcrypt");

export class UserBusiness {
    constructor(
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator
    ) { }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new Error("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new Error("'password' deve ser string")
        }

        const userDB = await this.getUserByEmail(email)

        if (!userDB) {
            throw new Error("'email' não encontrado")
        }

        const result = bcrypt.compareSync(password, userDB.password);

        if (!result) {
            throw new Error("'password' incorretos")
        }


        const tokenPayload: TTokenPayload = {
            id: userDB.id,
            name: userDB.name,
            role: userDB.role
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: LoginOutputDTO = {             
            token,
            mensagem:"Login realizado com sucesso"
        }
    

        return output
    }

    public getUserByEmail = async (email: string): Promise<TUser> => {

        const users = await db.raw(`SELECT * FROM users WHERE email = "${email}";`)
        return users?.[0]

    }

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

        const { name, email, password } = input


        const id = this.idGenerator.generate()
        const role =USER_ROLES.NORMAL
        const createdAt = new Date().toISOString()

        const newUser = new User(
            id,
            name,
            email,
            password,
            role,
            createdAt)
        

        await this.inserirUsuario(newUser)

        const tokenPayload: TTokenPayload = {
            id: id,
            name: name,
            role: role
        }

        const token = new TokenManager().createToken(tokenPayload)

        const output: SignupOutputDTO = {
            mensagem: "Cadastro realizado com sucesso",
            token
        }

        return output
    }

    public inserirUsuario = async (newUser: User): Promise<string> => {
        let id = this.idGenerator.generate();
        let zero = 0

        const hash = bcrypt.hashSync(newUser.getPassword(), 5);

        await db.raw(`
    INSERT INTO users (id, name, email, password, role) 
    VALUES("${id}", "${newUser.getName()}", "${newUser.getEmail()}", "${hash}", "${newUser.getRole()}");
        `)

        return id
    }

}