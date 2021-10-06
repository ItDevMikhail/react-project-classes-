import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    tokenId: {type: String},
    userId: {type: String},
});

export default mongoose.model('Token', TokenSchema);