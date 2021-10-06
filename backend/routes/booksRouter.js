import Router from "express";
import BooksController from "../controllers/booksController.js";

const booksRouter = new Router();

booksRouter.get('', BooksController.getBooks);
booksRouter.post('/add', BooksController.addBook);
booksRouter.get('/detail/:id', BooksController.getBook);
booksRouter.get('/addFavorite/:id', BooksController.addToFavorite);
booksRouter.get('/favorite', BooksController.getFavorite);



export default booksRouter;