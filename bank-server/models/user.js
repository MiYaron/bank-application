import { Timestamp } from "bson";
import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        role: { type: String, required: false, default: "client" },
    },
    { timestamps: true }
);

export default mongoose.model("users", userSchema);
