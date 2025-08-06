import { User } from "../model/User";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { ExjobbAd } from "../model/exjobbAd";

export async function createStudent(data: { name: string; phone?: string; email: string; program: string; password: string }) {
  // Check for existing phone or email
  const orConditions: any[] = [{ email: data.email }];
  if (data.phone) {
    orConditions.push({ phone: data.phone });
  }

  const exists = await User.findOne({
    where: {
      [Op.or]: orConditions
    }
  });
  if (exists) return null;

  // Hash password
  const hashed = await bcrypt.hash(data.password, 10);
  // Create user
  const student = await User.create({
    ...data,
    password: hashed,
    role: "student"
  });
  // Don't return the password hash
  const studentJson = student.toJSON() as any;
  delete studentJson.password;
  return studentJson;
}

export async function findStudentByEmailOrPhone(identifier: string) {
  return User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { phone: identifier }],
    },
  });
}

export async function verifyStudentLogin(identifier: string, password: string) {
  const student = await findStudentByEmailOrPhone(identifier);
  if (!student) return null;
  const passwordMatch = await bcrypt.compare(password, student.password);
  if (!passwordMatch) return null;
  // Don’t send password in response!
  const { id, name, email, phone, program } = student;
  return { id, name, email, phone, program };
}

export async function updateStudentInfo(
  studentId: number,
  updates: { name?: string; phone?: string; program?: string; description?: string }
) {
  const student = await User.findByPk(studentId);
  if (!student) return null;

  // Prevent updating email
  delete (updates as any).email;

  await student.update(updates);
  const updated = student.toJSON() as any;
  delete updated.password;
  return updated;
}

export async function getAllStudents() {
  const students = await User.findAll({
    where: { role: "student" },
    attributes: { exclude: ["password"] },
  });
  return students.map((s) => s.toJSON());
}

export async function getStudentsByPrograms(programs: string[]) {
  if (programs.length === 0) return [] as any[];
  const students = await User.findAll({
    where: {
      role: "student",
      program: { [Op.in]: programs },
    },
    attributes: { exclude: ["password"] },
  });
  return students.map((s) => s.toJSON());

}

export async function getStudentsForAd(adId: number) {
  const ad = await ExjobbAd.findByPk(adId);
  if (!ad) return null;

  const students = await User.findAll({
    where: {
      role: "student",
      program: { [Op.in]: ad.programs },
    },
  });

  const keywords = `${ad.title} ${ad.description}`
    .toLowerCase()
    .match(/\b\w+\b/g) || [];

  const filtered = students.filter((student) => {
    if (!student.description) return false;
    const desc = student.description.toLowerCase();
    return keywords.some((kw) => desc.includes(kw));
  });

  return filtered.map((s) => {
    const json = s.toJSON() as any;
    delete json.password;
    return json;
  });
}