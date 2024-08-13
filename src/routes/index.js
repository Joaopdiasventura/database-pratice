import { Router } from "express";
import { UserController } from "../user/user.controller.js";

const app = Router()
const userController = new UserController()

app.post("/create", userController.create)
app.post("/login", userController.login)

app.get("/decode/:token", userController.decode)

export default app;