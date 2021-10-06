import Library from "../models/books.js";
import TokenSchema from "../models/token.js";
import Favorite from "../models/favorite.js";
import { verifyJWT } from "../encrypting/token.js";

class BooksController {
    async getBooks(req, res) {
        try {
            console.log('запрос пришел')
            const book = await Library.find();
            if (book.length > 0) {
                res.json(book);
            } else {
                res.status(404).json({ message: 'Библиотека книг пуста' })
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async getBook(req, res) {
        try {
            console.log('запрос пришел')
            const id = req.params.id;
            console.log(id)
            const book = await Library.findById(id);
            if (book) {
                res.json(book);
            } else {
                res.status(404).json({ message: 'Библиотека книг пуста' })
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async addBook(req, res) {
        try {
            const book = req.body;
            const checkBook = await Library.findOne({ name: book.name });
            if (checkBook) {
                res.status(400).json({ msg: 'Такая книга уже есть' });
            } else {
                console.log('почти создал');
                const addBook = await Library.create({ ...book });
                res.json(addBook);
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async addToFavorite(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const data = verifyJWT(refreshToken);
            const tokenId = JSON.stringify(data.id);
            const checkToken = await TokenSchema.findOne({ tokenId: tokenId });
            if (checkToken) {
                const bookId = req.params.id;
                const deleteFavorite = await Favorite.findOneAndDelete({ userId: checkToken.userId, bookId: bookId });
                if (!deleteFavorite) {
                    await Favorite.create({ userId: checkToken.userId, bookId: bookId });
                    const favorite = await Favorite.find({ userId: checkToken.userId });
                    res.json(favorite);
                } else {
                    const favorite = await Favorite.find({ userId: checkToken.userId });
                    res.json(favorite);
                }
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
    async getFavorite(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const data = verifyJWT(refreshToken);
            const tokenId = JSON.stringify(data.id);
            const checkToken = await TokenSchema.findOne({ tokenId: tokenId });
            if (checkToken) {
                const favorite = await Favorite.find({ userId: checkToken.userId });
                res.json(favorite);
            } else {
                return res.json();
            }
        } catch (e) {
            res.status(500).json(e)
        }
    }
}

export default new BooksController();
