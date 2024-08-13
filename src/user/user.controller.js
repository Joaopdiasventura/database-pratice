import { userService } from "./user.service.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "pudim";

export class UserController {
    async create(req, res) {
        const { body } = req;
        const existUser = await userService.findByEmail(body.email);
        if (existUser) {
            return res.status(400).send({ message: "Esse email já está cadastrado" });
        }

        console.log("antes", body.password);
        body.password = await hash(body.password, 10);
        console.log("depois", body.password);

        const user = await userService.create(body);

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(201).send({ token });
    }

    async login(req, res) {
        const { body } = req;
        const user = await userService.findByEmail(body.email);
        if (!user) {
            return res.status(404).send({ message: "Esse email não está cadastrado" });
        }

        console.log('Senha fornecida:', body.password);
        console.log('Senha hashada armazenada:', user.password);

        console.log(await compare(body.password, user.password));

        if (!(await compare(body.password, user.password))) {
            return res.status(401).send({ message: "Senha incorreta" });
        }

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).send({ token });
    }

    async decode(req, res) {
        const { token } = req.params;

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await userService.findByEmail(decoded.email);
            if (!user) {
                return res.status(404).send({ message: "Esse email não está cadastrado" });
            }

            return res.status(200).send(user);
        } catch (error) {
            return res.status(400).send({ message: "Token inválido" });
        }
    }
}
