import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      name: process.env.ADMIN_NAME || "Nishant Singh Vats",
      email: process.env.ADMIN_EMAIL || "nishant805180@gmail.com",
      mobile: process.env.ADMIN_MOBILE || "6200576221",
      password: process.env.ADMIN_PASSWORD || "@sandip2028",
      role: "admin",
      department: "Founder",
      isBlocked: false
    };

    const existingAdmin = await User.findOne({ email: adminData.email }).select("+password");

    if (existingAdmin) {
      existingAdmin.name = adminData.name;
      existingAdmin.mobile = adminData.mobile;
      existingAdmin.password = adminData.password;
      existingAdmin.role = "admin";
      existingAdmin.department = "";
      existingAdmin.isBlocked = false;
      await existingAdmin.save();
      console.log(`Admin updated: ${adminData.email}`);
      process.exit(0);
    }

    await User.create(adminData);
    console.log(`Admin created: ${adminData.email}`);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

createAdmin();
