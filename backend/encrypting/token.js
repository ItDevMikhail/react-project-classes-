import jwt from 'jsonwebtoken';
import { privateData } from '../config/config.js';
import TokenSchema from "../models/token.js"

export function generateAccessToken(userId) {
    const data = {
        userId,
        type: privateData.jwt.tokens.access.type,
        id: Date.now(),
    };
    const options = { expiresIn: privateData.jwt.tokens.access.expiresIn };
    return jwt.sign(data, privateData.jwt.secret, options);
}

export function generateRefreshToken() {
    const data = {
        id: Date.now(),
        type: privateData.jwt.tokens.refresh.type,
    };
    const options = { expiresIn: privateData.jwt.tokens.refresh.expiresIn };
    return {
        id: data.id,
        token: jwt.sign(data, privateData.jwt.secret, options),
    }
}

export async function addDBRefreshToken(tokenId, userId){
    await TokenSchema.replaceOne({ userId: userId }, { tokenId, userId}, { upsert: true})
}
export function verifyJWT(token) {
    return jwt.verify(token, privateData.jwt.secret);
}