import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://onlyjuice:buddhikaeshan@cluster0.ugfblpy.mongodb.net/?').then(() => console.log("DB connected"));
}