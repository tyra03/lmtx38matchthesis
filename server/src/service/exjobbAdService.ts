// src/service/exjobbAdService.ts
import { ExjobbAd } from "../model/exjobbAd";
import { User } from "../model/User";

export async function createExjobbAd(
  data: Omit<ExjobbAd, "id" | "approved"> & { companyId: number }
) {
  // companyId must correspond to a user with role "company"
  const company = await User.findByPk(data.companyId);
  if (!company || company.role !== "company") return null;
  // Save as not approved
  const ad = await ExjobbAd.create({ ...data, status: "pending" });
  return ad.toJSON();
}

export async function approveExjobbAd(adId: number, adminId: number) {
  // Only admin can approve
  const admin = await User.findByPk(adminId);
  if (!admin || admin.role !== "admin") return null;
  const ad = await ExjobbAd.findByPk(adId);
  if (!ad) return null;
  ad.status = "approved";
  await ad.save();
  return ad.toJSON();
}

export async function getApprovedAds() {
  return await ExjobbAd.findAll({ where: { status: "approved" } });
}
