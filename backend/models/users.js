import mongoose from "mongoose";

const Users = new mongoose.Schema({
    login: {type: String, required: true, unique: true},
    name: {type: String},
    lastName: {type: String},
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}, 
    role: {type: String, default: 'User'}, 
});

export default mongoose.model('Users', Users);