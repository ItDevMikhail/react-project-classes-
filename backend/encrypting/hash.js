import { createHmac } from "crypto";
import { privateData } from "../config/config.js";

export default function Hashing(password) {
    const hash = createHmac('sha256', privateData.secret)
        .update(password)
        .digest('hex');
    return hash;
}