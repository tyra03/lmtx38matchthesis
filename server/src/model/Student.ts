import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./index";

interface StudentAttributes {
  id: number;
  name: string;
  phone: string;
  email: string;
  program: string;
  password: string;
}

interface StudentCreationAttributes extends Optional<StudentAttributes, "id"> {}

export class Student extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes {
  public id!: number;
  public name!: string;
  public phone!: string;
  public email!: string;
  public program!: string;
  public password!: string;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    program: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "students",
    timestamps: false,
  }
);
