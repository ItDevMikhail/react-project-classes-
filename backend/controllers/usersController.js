import Users from "../models/users.js"
import Hashing from "../encrypting/hash.js";
import { generateAccessToken, generateRefreshToken, verifyJWT, addDBRefreshToken } from "../encrypting/token.js";
import { privateData } from "../config/config.js";
import TokenSchema from "../models/token.js"



class UsersController {

    async autorization(req, res) {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        console.log(req.cookies)
        try {
            if (!accessToken) {
                if (!refreshToken) {
                    res.status(403).json({ message: 'No token', access: false });
                } else {
                    console.log(refreshToken)
                    const data = verifyJWT(refreshToken);
                    const tokenId = JSON.stringify(data.id);
                    const newRefreshtoken = generateRefreshToken();
                    const checkToken = await TokenSchema.findOneAndUpdate({ tokenId: tokenId }, { tokenId: newRefreshtoken.id })
                    console.log(checkToken)
                    if (checkToken) {
                        const accessToken = generateAccessToken(checkToken.userId);
                        const accessExpires = privateData.jwt.tokens.access.expiresIn;
                        const refreshExpires = privateData.jwt.tokens.refresh.expiresIn;
                        res.cookie('refreshToken', newRefreshtoken.token, { maxAge: refreshExpires * 1000, httpOnly: true });
                        res.cookie('accessToken', accessToken, { maxAge: accessExpires * 1000, httpOnly: true })
                        res.json({ message: 'токены обновлены, доступ разрешен', access: true });
                    }
                    res.status(403).json({ message: 'Token invalid', access: false });
                }
            } else {
                const data = verifyJWT(accessToken);
                console.log(data);
                res.json({ message: 'Token is valid', access: true });
            }
        } catch (e) {
            res.status(500);
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie('refreshToken', { httpOnly: true });
            res.clearCookie('accessToken', { httpOnly: true }).status(200).json({ message: "Successfully logged out" });
        } catch (e) {
            res.status(500);
        }
    }
    async addUser(req, res) {
        try {
            let user = req.body;
            user.login = user.login.toLowerCase();
            console.log(user);
            user.password = Hashing(user.password);
            await Users.create(user);
            res.json({ message: 'Пользователь успешно добавлен' });
        } catch (e) {
            res.status(500).json(e);
        }
    }
    async login(req, res) {
        try {
            const user = req.body;
            user.login = user.login.toLowerCase();
            const checkUser = await Users.findOne({ login: user.login });
            if (checkUser) {
                user.password = Hashing(user.password);
                if (checkUser.password === user.password) {
                    const accessToken = generateAccessToken(checkUser._id);
                    const refreshToken = generateRefreshToken();
                    addDBRefreshToken(refreshToken.id, checkUser._id);
                    const accessExpires = privateData.jwt.tokens.access.expiresIn;
                    const refreshExpires = privateData.jwt.tokens.refresh.expiresIn;
                    res.cookie('refreshToken', refreshToken.token, { maxAge: refreshExpires * 1000, httpOnly: true });
                    res.cookie('accessToken', accessToken, { maxAge: accessExpires * 1000, httpOnly: true });
                    res.json({ message: 'вы успешно авторизовались' });
                } else {
                    res.status(401).json({ message: 'Неверный пароль' });
                }
            } else {
                res.status(400).json({ message: 'Такого пользователя не существует' });
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

export default new UsersController();
