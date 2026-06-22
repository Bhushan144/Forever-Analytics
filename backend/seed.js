import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import userModel from './src/models/userModel.js'; // Adjust the path to your user model
import dotenv from 'dotenv';

dotenv.config();

const createAdminAccount = async () => {
  try {
    // 1. Connect to the database
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

    // 2. Check if an admin account already exists
    const adminExists = await userModel.findOne({ role: 'Admin' });
    if (adminExists) {
      console.log('Admin account already exists.');
      return;
    }

    // 3. Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Please define ADMIN_EMAIL and ADMIN_PASSWORD in your .env file.');
      return;
    }

    // 4. Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // 5. Create the new admin user
    const adminUser = new userModel({
      name: 'Admin', // Or get from .env
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin',
    });

    await adminUser.save();
    console.log('✅ Admin account created successfully!');

  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    // 6. Disconnect from the database
    await mongoose.disconnect();
  }
};

createAdminAccount();