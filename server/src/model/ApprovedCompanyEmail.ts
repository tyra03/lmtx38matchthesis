import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";

export interface ApprovedCompanyEmailAttributes {
  id: number;
  email: string;
  token?: string | null;
}

interface ApprovedCompanyEmailCreationAttributes extends Optional<ApprovedCompanyEmailAttributes, "id"> {}

export class ApprovedCompanyEmail extends Model<ApprovedCompanyEmailAttributes, ApprovedCompanyEmailCreationAttributes> implements ApprovedCompanyEmailAttributes {
  public id!: number;
  public email!: string;
  public token!: string | null;
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
    token: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "ApprovedCompanyEmails",
    timestamps: false,
  }
);