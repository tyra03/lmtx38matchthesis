import { Op } from "sequelize";
import { StudentAction } from "../model/studentAction";
import { ExjobbAction } from "../model/exjobbAction";
import { ExjobbAd } from "../model/exjobbAd";
import { Match } from "../model/match";
import { Message } from "../model/message";
import { User } from "../model";

Match.belongsTo(User, { foreignKey: "studentId", as: "student" });

export async function addStudentAction(
  companyId: number,
  studentId: number,
  type: "like" | "favorite" | "dislike"
) {
  const action = await StudentAction.create({ companyId, studentId, type });

  let match: Match | null = null;
  if (type === "like") {
    const ads = await ExjobbAd.findAll({ where: { companyId }, attributes: ["id"] });
    const adIds = ads.map((a) => a.id);
    if (adIds.length > 0) {
      const studentLike = await ExjobbAction.findOne({
        where: {
          userId: studentId,
          type: "like",
          adId: { [Op.in]: adIds },
        },
      });
      if (studentLike) {
        match = await Match.findOne({ where: { companyId, studentId } });
        if (!match) {
          match = await Match.create({ companyId, studentId });
        }
      }
    }
  }
  return { action, match };
}

export function listMatchesForCompany(companyId: number) {
return Match.findAll({
    where: { companyId },
    include: [{ model: User, as: "student", attributes: ["id", "name"] }],
  });
}

export function listMatchesForStudent(studentId: number) {
  return Match.findAll({ where: { studentId } });
}

export function listMessages(matchId: number) {
  return Message.findAll({ where: { matchId }, order: [["createdAt", "ASC"]] });
}

export function sendMessage(
  matchId: number,
  senderId: number,
  senderRole: "company" | "student",
  content: string
) {
  return Message.create({ matchId, senderId, senderRole, content });
}