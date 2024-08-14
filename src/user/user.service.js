import { prisma } from "../services/prisma.service.js";

class UserService {
    async create(data) {
        return (await prisma.user.create({ data })).email
    }

    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } })
    }
}

export const userService = new UserService();