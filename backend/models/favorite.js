import mongoose from "mongoose";

const Favorite = new mongoose.Schema({
    userId: {type: String, required: true},
    bookId: {type: String, required: true},
});

export default mongoose.model('Favorite', Favorite);