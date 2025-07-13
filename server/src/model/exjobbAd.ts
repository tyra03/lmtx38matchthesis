import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

export interface ExjobbAdAttributes {
  id: number;
  title: string;
  points: number;
  location: string;
  programs: string[];    // Array of educational programs
  numStudents: number;
  imageUrl?: string;
  description: string;
  companyId: number;     // FK to User (company)
  status: "pending" | "accepted" | "rejected";
}

interface ExjobbAdCreationAttributes extends Optional<ExjobbAdAttributes, "id" | "imageUrl" | "status"> {}

export class ExjobbAd extends Model<ExjobbAdAttributes, ExjobbAdCreationAttributes>
  implements ExjobbAdAttributes {
  public id!: number;
  public title!: string;
  public points!: number;
  public location!: string;
  public programs!: string[];
  public numStudents!: number;
  public imageUrl?: string;
  public description!: string;
  public companyId!: number;
  public status!: "pending" | "accepted" | "rejected";
}

ExjobbAd.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    programs: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false },
    numStudents: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM("pending", "accepted", "rejected"), defaultValue: "pending" }
  },
  {
    sequelize,
    tableName: "exjobb_ads",
    timestamps: false,
  }
);
