 // src/service/exjobbAdService.ts
import { ExjobbAd, ExjobbAdAttributes } from "../model/exjobbAd";
import { User } from "../model/User";

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
  await ExjobbAd.update(
    { status: "approved" },
    { where: { status: "accepted" } }
  );
}