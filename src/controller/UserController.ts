import { Request, Response } from "express"
import { login, signup } from "../database"
import { TLoginRequest, TSignUpRequest } from "../types"


export class UserController {
    constructor(
    ) { }

    public login = async (req: Request, res: Response) => {
        try {

            const input: TLoginRequest = {
                email: req.body.email,
                password: req.body.password
            }

            const output = await login(input)

            res.status(200).send(output)
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

    public signup = async (req: Request, res: Response) => {

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

}
