import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Category = sequelize.define(
  "Category",
  {
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryImg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    timestamps: true,
  }
);
