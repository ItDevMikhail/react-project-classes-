import mongoose from "mongoose";

const Library = new mongoose.Schema({
    name: {type: String, unique: true,required: true},
    description: {type: String, required: true},
    picture: {type: String},
});

export default mongoose.model('Library', Library);