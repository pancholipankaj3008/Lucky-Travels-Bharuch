// require("dotenv").config();

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const Admin = require("./models/Admin");

// const createAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     const existingAdmin = await Admin.findOne({
//       email: process.env.ADMIN_EMAIL,
//     });

//     if (existingAdmin) {
//       console.log("Admin already exists");
//       process.exit(0);
//     }

//     const hashedPassword = await bcrypt.hash(
//       process.env.ADMIN_PASSWORD,
//       10
//     );

//     await Admin.create({
//       name: "Admin",
//       email: process.env.ADMIN_EMAIL,
//       password: hashedPassword,
//     });

//     console.log("Admin created successfully");
//     process.exit(0);
//   } catch (error) {
//     console.log("Error:", error.message);
//     process.exit(1);
//   }
// };

// createAdmin();