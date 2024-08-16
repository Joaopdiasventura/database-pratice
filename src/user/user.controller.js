import { userService } from "./user.service.js";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const { JWT_SECRET, SALT_ROUNDS } = process.env;

class UserController {
  async create(req, res) {
    const { body } = req;

    try {
      const existUser = await userService.findByEmail(body.email);
      if (existUser) {
        return res
          .status(400)
          .send({ message: "Esse email já está cadastrado" });
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
      if (!user)
        return res
          .status(404)
          .send({ message: "Esse email não está cadastrado" });

      if (!(await this.comparePassword(body.password, user.password)))
        return res.status(401).send({ message: "Senha incorreta" });

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

      if (!user) return res.status(400).send({ message: "Token inválido" });

      return res.status(200).send(user);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return res.status(400).send({ message: "Token inválido" });
    }
  }

  async update(req, res) {
    try {
      const { body, params } = req;

      const user = await userService.findByEmail(params.email);

      if (!user)
        return res
          .status(404)
          .send({ message: "Esse email não está cadastrado" });

      if ("email" in body) delete body.email;

      if ("password" in body)
        body.password = await this.hashPassword(body.password);

      return res
        .status(200)
        .send({ message: await userService.update(params.email, body) });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }

  async delete(req, res) {
    try {
      const { params } = req;

      const user = await userService.findByEmail(params.email);

      if (!user)
        return res
          .status(404)
          .send({ message: "Esse email não está cadastrado" });

      return res
        .status(200)
        .send({ message: await userService.delete(params.email) });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }

  createToken(email) {
    return jwt.sign(email, JWT_SECRET);
  }

  async hashPassword(password) {
    return await hash(password, parseInt(SALT_ROUNDS));
  }

  async comparePassword(password, password_) {
    return await compare(password, password_);
  }
}

export const userController = new UserController();
