import { User } from "../model";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export async function findAdminByEmailOrPhone(identifier: string) {
  return User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { phone: identifier }],
      role: "admin",
    },
  });
}

export async function verifyAdminLogin(identifier: string, password: string) {
  const admin = await findAdminByEmailOrPhone(identifier);
  if (!admin) return null;
  const match = await bcrypt.compare(password, admin.password);
  if (!match) return null;
  const { id, name, email, phone, role } = admin;
  return { id, name, email, phone, role };
}