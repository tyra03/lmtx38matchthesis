import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "./db";

export interface UserAttributes {
  id: number;
  name: string;
  phone: string;
  email: string;
  program?: string; // only for students
  password: string;
  role: "student" | "company" | "admin";
  companyName?: string;
  imageUrl?: string; // <-- add this in UserAttributes
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "program" | "companyName"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public phone!: string;
  public email!: string;
  public program?: string;
  public password!: string;
  public role!: "student" | "company" | "admin";
  public companyName?: string;
}

User.init(
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },

    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    phone: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },

    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },

    program: { 
      type: DataTypes.STRING, 
      allowNull: true 
    }, // nullable for company/admin

    password: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },

    role: { 
      type: DataTypes.ENUM("student", "company", "admin"), 
      allowNull: false 
    },

    companyName: { 
      type: DataTypes.STRING, 
      allowNull: true 
    }, // nullable for students/admin

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },


  },
  {
    sequelize,
    tableName: "Users",
    timestamps: false,
  }
);
