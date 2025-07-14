import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

export interface ApprovedCompanyEmailAttributes {
  id: number;
  email: string;
}

interface ApprovedCompanyEmailCreationAttributes extends Optional<ApprovedCompanyEmailAttributes, "id"> {}

export class ApprovedCompanyEmail extends Model<ApprovedCompanyEmailAttributes, ApprovedCompanyEmailCreationAttributes> implements ApprovedCompanyEmailAttributes {
  public id!: number;
  public email!: string;
}

ApprovedCompanyEmail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "ApprovedCompanyEmails",
    timestamps: false,
  }
);