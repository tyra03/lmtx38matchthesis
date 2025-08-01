 // src/service/exjobbAdService.ts
import { ExjobbAd, ExjobbAdAttributes } from "../model/exjobbAd";
import { User } from "../model/User";
import { ExjobbAction } from "../model/exjobbAction";


export async function createExjobbAd(
  data: Omit<ExjobbAdAttributes, "id" | "status"> & { companyId?: number | null }) {
  // companyId must correspond to a user with role "company"
  if (data.companyId) {
    const company = await User.findByPk(data.companyId);
    if (!company || company.role !== "company") return null;
  }
  // Save as pending
  const ad = await ExjobbAd.create({ ...data, status: "pending" });
  return ad.toJSON();
}

export async function updateAdStatus(adId: number, status: "approved" | "rejected", adminId: number) {
  const admin = await User.findByPk(adminId);
  if (!admin || admin.role !== "admin") return null;
  const ad = await ExjobbAd.findByPk(adId);
  if (!ad) return null;
  ad.status = status;
  await ad.save();
  return ad.toJSON();
}

export async function getApprovedAds() {
  return await ExjobbAd.findAll({ where: { status: "approved" } });
}

export async function getPendingAds() {
 const ads = await ExjobbAd.findAll({ where: { status: "pending" } });
 return ads.map((ad) => ad.toJSON());
}

export async function migrateAdStatuses() {
  const [count] = await ExjobbAd.update(
    { status: "approved" },
    { where: { status: "accepted" } }
  );
  return count;
}

export async function getAdsForCompany(companyId: number) {
  const ads = await ExjobbAd.findAll({ where: { companyId } });
  return ads.map((a) => a.toJSON());
}

export async function getStudentsForAd(adId: number) {
  const actions = await ExjobbAction.findAll({ where: { adId } });
  const studentIds = Array.from(new Set(actions.map((a) => a.userId)));
  if (studentIds.length === 0) return [];
  const students = await User.findAll({
    where: { id: studentIds, role: "student" },
    attributes: { exclude: ["password"] },
  });
  return students.map((s) => s.toJSON());
}

export async function createOrUpdateAction(
  userId: number,
  adId: number,
  type: "like" | "favorite" | "dislike"
) {
  let action = await ExjobbAction.findOne({ where: { userId, adId } });
  if (action) {
    action.type = type;
    await action.save();
  } else {
    action = await ExjobbAction.create({ userId, adId, type });
  }
  return action.toJSON();
}

export async function deleteAction(userId: number, adId: number) {
  const count = await ExjobbAction.destroy({ where: { userId, adId } });
  return count > 0;
}

export async function getFavoritesForUser(userId: number) {
  const actions = await ExjobbAction.findAll({
    where: { userId, type: "favorite" },
  });
  const adIds = actions.map((a) => a.adId);
  if (adIds.length === 0) return [];
  const ads = await ExjobbAd.findAll({ where: { id: adIds } });
  return ads.map((ad) => ad.toJSON());
}