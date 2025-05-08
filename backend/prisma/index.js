import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

const l = await prisma.studentCourse.findMany()
console.log(l);
export { prisma };