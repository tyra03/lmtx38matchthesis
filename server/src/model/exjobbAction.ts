// src/model/ExjobbInteraction.ts
import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db";

export class ExjobbAction extends Model {
  public id!: number;
  public userId!: number;
  public adId!: number;
  public type!: "like" | "favorite" | "dislike";
}

ExjobbAction.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    userId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },

    adId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
   
    type: { 
      type: DataTypes.ENUM("like", "favorite", "dislike"), 
      allowNull: false 
    },
  },
  
  {
    sequelize,
    tableName: "exjobb_interactions",
    timestamps: false,
  }
);
