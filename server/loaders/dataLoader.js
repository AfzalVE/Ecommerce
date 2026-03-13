import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

export const seedAdmin = async () => {
 try {

  const adminEmail = process.env.ADMIN_EMAIL;

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
   logger.info("Admin user already exists");
   return;
  }

  const hashedPassword = await bcrypt.hash(
   process.env.ADMIN_PASSWORD,
   10
  );

  const adminUser = new User({
   name: "Super Admin",
   email: adminEmail,
   password: hashedPassword,
   role: "admin"
  });

  await adminUser.save();

  logger.info("Default admin user created");

 } catch (error) {
  logger.error("Admin seeding failed: " + error.message);
 }
};