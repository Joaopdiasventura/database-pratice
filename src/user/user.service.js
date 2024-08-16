import { prisma } from "../services/prisma.service.js";

class UserService {
  async create(data) {
    return (await prisma.user.create({ data })).email;
  }

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async update(email, data) {
    await prisma.user.update({ where: { email }, data });
    return "Usuário atualizado com sucesso";
  }

  async delete(email) {
    await prisma.user.delete({ where: { email } });
    return "Usuário deletado com sucesso";
  }
}

export const userService = new UserService();
