import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TTokenPayload } from '../types'

require("dotenv").config();
dotenv.config()

export class TokenManager {

    public createToken = (payload: TTokenPayload): string => {
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        return token
    }

    public getPayload = (token: string): TTokenPayload | null => {
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_KEY as string
            )

            return payload as TTokenPayload

        } catch (error) {
            return null
        }
    }
}