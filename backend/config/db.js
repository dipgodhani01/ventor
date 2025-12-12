import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "ventor", // DB NAME
  "root", // MySQL USERNAME
  "", // MySQL PASSWORD
  {
    host: "localhost",
    dialect: "mysql",
    logging: false, // SQL logs hide
  }
);
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL Connected Successfully");
    await sequelize.sync();
    console.log("📦 Models Synced");
  } catch (error) {
    console.error("❌ MySQL Connection Error:", error);
  }
};
export default connectDB;
