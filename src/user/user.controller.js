import { userService } from "./user.service.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "pudim";
const SALT_ROUNDS = 10;

export class UserController {
    async create(req, res) {
        const { body } = req;

        try {
            const existUser = await userService.findByEmail(body.email);
            if (existUser) {
                return res.status(400).send({ message: "Esse email já está cadastrado" });
            }

            body.password = await this.hashPassword(body.password);

            const user = await userService.create(body);

            return res.status(200).send({ token: this.createToken(user) });
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            return res.status(500).send({ message: "Erro ao criar usuário" });
        }
    }

    async login(req, res) {
        const { body } = req;

        try {
            const user = await userService.findByEmail(body.email);
            if (!user) {
                return res.status(404).send({ message: "Esse email não está cadastrado" });
            }

            if (!await this.comparePassword(body.password, user.password)) {
                return res.status(401).send({ message: "Senha incorreta" });
            }

            return res.status(200).send({ token: this.createToken(user.email) });
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            return res.status(500).send({ message: "Erro ao fazer login" });
        }
    }

    async decode(req, res) {
        const { token } = req.params;

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            const user = await userService.findByEmail(decoded);
            if (!user) {
                return res.status(400).send({ message: "Token inválido" });
            }

            return res.status(200).send(user);
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            return res.status(400).send({ message: "Token inválido" });
        }
    }

    createToken(email) {
        return jwt.sign(email, JWT_SECRET)
    }

    async hashPassword(password) {
        return await hash(password, SALT_ROUNDS);
    }

    async comparePassword(password, password_) {
        return await compare(password, password_);
    }
}
