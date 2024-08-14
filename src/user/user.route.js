import { Router } from "express";
import { UserController } from "./user.controller.js";

const app = Router();
const userController = new UserController();

app.post("/create", (req, res) => userController.create(req, res));
app.post("/login", (req, res) => userController.login(req, res));
app.get("/decode/:token", (req, res) => userController.decode(req, res));

export const UserRoutes = app;
