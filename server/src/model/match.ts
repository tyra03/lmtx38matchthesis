import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";

export class Match extends Model {
  public id!: number;
  public companyId!: number;
  public studentId!: number;
  public createdAt!: Date;
}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "matches",
    timestamps: false,
  }
);