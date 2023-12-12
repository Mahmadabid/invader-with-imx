import mongoose, { Schema } from "mongoose";

const gameSchema = new Schema(
    {
        userId: String,
        data: {
            IPX: Number,
            Address: String,
            TotalPoints: Number
        }
    }
)

const Invader = mongoose.models.Invader || mongoose.model("Invader", gameSchema);

export default Invader