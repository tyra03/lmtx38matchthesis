import { User } from "../model/User";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export async function createCompany(data: { name: string; phone: string; email: string; password: string; companyName: string }) {
  const exists = await User.findOne({
    where: {
      [Op.or]: [
        { phone: data.phone },
        { email: data.email }
      ]
    }
  });
  if (exists) return null;
  const hashed = await bcrypt.hash(data.password, 10);
  const company = await User.create({
    ...data,
    password: hashed,
    role: "company"
  });
  const companyJson = company.toJSON() as any;
  delete companyJson.password;
  return companyJson;
}

export async function findCompanyByEmailOrPhone(identifier: string) {
  return User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { phone: identifier }],
      role: "company",
    },
  });
}

export async function verifyCompanyLogin(identifier: string, password: string) {
  const company = await findCompanyByEmailOrPhone(identifier);
  if (!company) return null;
  const match = await bcrypt.compare(password, company.password);
  if (!match) return null;
  const { id, name, email, phone, companyName } = company;
  return { id, name, email, phone, companyName };
}