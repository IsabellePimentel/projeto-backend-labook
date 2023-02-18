import express from "express";

import cors from "cors";
import { userRouter } from "./router/userRouter";
import { postRouter } from "./router/postRouter";

const app = express()
app.use(express.json())
app.use(cors())

app.use("/posts", postRouter)
app.use("/users", userRouter)
app.listen(3000);
