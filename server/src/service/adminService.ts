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

// Ensure that a default admin user exists in the database.
// The default credentials are:
//   email: "tyraadmin"
//   password: "Ftstwa20031997!"
export async function ensureDefaultAdmin() {
  const existing = await User.findOne({ where: { email: "tyraadmin" } });
  if (existing) return;

  const hashed = await bcrypt.hash("Ftstwa20031997!", 10);
  await User.create({
    name: "Default Admin",
    phone: "0000000000",
    email: "tyraadmin",
    password: hashed,
    role: "admin",
  });
}