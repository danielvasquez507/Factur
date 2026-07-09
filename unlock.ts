import { getBypassPrisma } from "./src/lib/prisma";

async function main() {
  const prisma = getBypassPrisma();
  await prisma.user.updateMany({
    where: { email: 'eliam.vasquez@gmail.com' },
    data: { failedLoginAttempts: 0, lockedUntil: null }
  });
  console.log('Usuario desbloqueado con éxito!');
}
main();
