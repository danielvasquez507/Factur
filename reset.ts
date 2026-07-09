import { getBypassPrisma } from "./src/lib/prisma";
import bcrypt from "bcryptjs";
async function main() {
  const prisma = getBypassPrisma();
  const hash = await bcrypt.hash("123456", 10);
  await prisma.user.updateMany({ data: { passwordHash: hash } });
  console.log("Password reset for ALL users.");
}
main().finally(() => process.exit(0));
