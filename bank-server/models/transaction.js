import mongoose from "mongoose";

const { Schema } = mongoose;

const transactionSchema = new Schema(
    {
        from: {
            id: { type: String, required: true },
            name: { type: String, required: true },
        },
        to: {
            id: { type: String, required: true },
            name: { type: String, required: true },
        },
        amount: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("transactions", transactionSchema);
