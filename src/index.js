import express from "express";
import UserRoutes from "./routes/index.js"

const app = express()

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoutes)

app.listen(3000, () => console.log("Servidor rodando"))