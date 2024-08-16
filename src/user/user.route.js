import { Router } from "express";
import { userController } from "./user.controller.js";

const app = Router();

app.post("/create", (req, res) => userController.create(req, res));
app.post("/login", (req, res) => userController.login(req, res));
app.get("/decode/:token", (req, res) => userController.decode(req, res));
app.patch("/:email", (req, res) => userController.update(req, res));
app.delete("/:email", (req, res) => userController.delete(req, res));

export const UserRoutes = app;
