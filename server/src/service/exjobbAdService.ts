 // src/service/exjobbAdService.ts
 import { ExjobbAd } from "../model/exjobbAd";
 import { User } from "../model/User";

export async function createExjobbAd(
  data: Omit<ExjobbAd, "id" | "status"> & { companyId: number }
) {
  // companyId must correspond to a user with role "company"
  const company = await User.findByPk(data.companyId);
  if (!company || company.role !== "company") return null;
  // Save as pending
  const ad = await ExjobbAd.create({ ...data, status: "pending" });
  return ad.toJSON();
}

export async function acceptAd(adId: number, adminId: number) {
   // Only admin can approve an ad
   const admin = await User.findByPk(adminId);
   if (!admin || admin.role !== "admin") return null;
   const ad = await ExjobbAd.findByPk(adId);
   if (!ad) return null;
   ad.status = "accepted";
   await ad.save();
   return ad.toJSON();
 }

 export async function rejectAd(adId: number, adminId: number) {
  const admin = await User.findByPk(adminId);
  if (!admin || admin.role !== "admin") return null;
  const ad = await ExjobbAd.findByPk(adId);
  if (!ad) return null;
  ad.status = "rejected";
  await ad.save();
  return ad.toJSON();
}

 export async function getAcceptedAds() {
   return await ExjobbAd.findAll({ where: { status: "accepted" } });
 }

 export async function getPendingAds() {
  return await ExjobbAd.findAll({ where: { status: "pending" } });
}
