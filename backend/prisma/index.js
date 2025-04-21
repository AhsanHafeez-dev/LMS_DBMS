import {PrismaClient} from "@prisma/client"

try {
    const prisma = new PrismaClient();
} catch (error) {
    console.log(error)
}
export { prisma };