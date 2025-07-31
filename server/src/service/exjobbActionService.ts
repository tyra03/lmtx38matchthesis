import { ExjobbAction } from "../model/exjobbAction";
import { ExjobbAd } from "../model/exjobbAd";

export async function createAction(
  userId: number,
  adId: number,
  type: "like" | "dislike" | "favorite"
) {
  const action = await ExjobbAction.create({ userId, adId, type });
  return action.toJSON();
}

export async function deleteAction(actionId: number, userId?: number) {
  const action = await ExjobbAction.findByPk(actionId);
  if (!action) return null;
  if (userId && action.userId !== userId) return null;
  await action.destroy();
  return true;
}

export async function getFavoriteAdsForUser(userId: number) {
  const favorites = await ExjobbAction.findAll({
    where: { userId, type: "favorite" },
  });
  const adIds = favorites.map((f) => f.adId);
  if (adIds.length === 0) return [] as any[];
  const ads = await ExjobbAd.findAll({ where: { id: adIds } });
  return ads.map((a) => a.toJSON());
}