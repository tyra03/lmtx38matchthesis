import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";

export class StudentAction extends Model {
  public id!: number;
  public companyId!: number;
  public studentId!: number;
  public type!: "like" | "favorite" | "dislike";
}

StudentAction.init(
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
    type: {
      type: DataTypes.ENUM("like", "favorite", "dislike"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "student_actions",
    timestamps: false,
  }
);