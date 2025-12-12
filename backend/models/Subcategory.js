import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Category } from "./Category.js";

export const Subcategory = sequelize.define(
  "Subcategory",
  {
    subcategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  }
);

Category.hasMany(Subcategory, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

Subcategory.belongsTo(Category, {
  foreignKey: "categoryId",
});
