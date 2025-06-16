import { Student } from "../model/Student";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export async function createStudent(data: { name: string; phone: string; email: string; program: string; password: string }) {
  // Check for existing phone or email
  const exists = await Student.findOne({
    where: {
      [Op.or]: [
        { phone: data.phone },
        { email: data.email }
      ]
    }
  });
  if (exists) return null;

  // Hash password
  const hashed = await bcrypt.hash(data.password, 10);

  // Create user
  const student = await Student.create({ ...data, password: hashed });
  // Don't return the password hash
  const studentJson = student.toJSON() as any;
  delete studentJson.password;
  return studentJson;
}
